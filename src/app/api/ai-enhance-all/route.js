import { NextResponse } from 'next/server';
import { authorizeAiRequest, fetchWithTimeout, readJsonBody } from '../../../lib/ai-request.js';

const MODEL_FALLBACKS = [
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2.5-7b-instruct',
];

export async function POST(request) {
  const access = await authorizeAiRequest({ route: 'ai-enhance-all', limit: 3 });
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 500 });

  try {
    const bodyResult = await readJsonBody(request, 48 * 1024);
    if (!bodyResult.ok) {
      return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
    }
    const body = bodyResult.data;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 });
    }
    const { experience, projects, certifications, education, targetJobTitle, targetJobDescription } = body || {};
    const collections = [
      ['experience', experience],
      ['projects', projects],
      ['certifications', certifications],
      ['education', education],
    ];
    for (const [name, items] of collections) {
      if (items !== undefined && (!Array.isArray(items) || items.length > 15)) {
        return NextResponse.json({ error: `${name} must be an array of at most 15 items` }, { status: 400 });
      }
      if (Array.isArray(items) && items.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
        return NextResponse.json({ error: `${name} contains an invalid item` }, { status: 400 });
      }
    }
    if (experience?.some((item) => (
      (item.bullets !== undefined
        && (!Array.isArray(item.bullets)
          || item.bullets.length > 10
          || item.bullets.some((bullet) => typeof bullet !== 'string' || bullet.length > 1500)))
    ))) {
      return NextResponse.json({ error: 'Experience bullets must be strings of at most 1500 characters' }, { status: 400 });
    }
    for (const [items, field] of [
      [projects, 'description'],
      [certifications, 'description'],
      [education, 'coursework'],
    ]) {
      if (items?.some((item) => item[field] !== undefined
        && (typeof item[field] !== 'string' || item[field].length > 2000))) {
        return NextResponse.json({ error: `${field} must be a string of at most 2000 characters` }, { status: 400 });
      }
    }
    if ((targetJobTitle !== undefined
      && (typeof targetJobTitle !== 'string' || targetJobTitle.length > 200))
      || (targetJobDescription !== undefined
        && (typeof targetJobDescription !== 'string' || targetJobDescription.length > 5000))) {
      return NextResponse.json({ error: 'Target job details are too long or invalid' }, { status: 400 });
    }

    // Build a structured prompt
    const inputData = { experience: [], projects: [], certifications: [], education: [] };

    if (Array.isArray(experience)) {
      inputData.experience = experience.map((e, i) => ({
        index: i,
        bullets: (e.bullets || []).filter(Boolean),
      })).filter((e) => e.bullets.length > 0);
    }
    if (Array.isArray(projects)) {
      inputData.projects = projects.map((p, i) => ({
        index: i,
        description: p.description || '',
      })).filter((p) => p.description.trim());
    }
    if (Array.isArray(certifications)) {
      inputData.certifications = certifications.map((c, i) => ({
        index: i,
        description: c.description || '',
      })).filter((c) => c.description.trim());
    }
    if (Array.isArray(education)) {
      inputData.education = education.map((e, i) => ({
        index: i,
        coursework: e.coursework || '',
      })).filter((e) => e.coursework.trim());
    }

    const hasContent = inputData.experience.length || inputData.projects.length || inputData.certifications.length || inputData.education.length;
    if (!hasContent) return NextResponse.json({ error: 'No content to enhance' }, { status: 400 });

    const jobContext = targetJobTitle 
      ? `\n\nTARGET JOB ROLE: "${targetJobTitle}"\n${targetJobDescription ? `INCORPORATE KEYWORDS FROM THIS DESCRIPTION:\n${targetJobDescription}` : ''}`
      : '';

    const prompt = `You are a professional resume writer. Enhance the following resume text fields.${jobContext}

STRICT RULES:
- Each enhanced text MUST have the SAME word count as the original (±2 words maximum)
- Start each bullet with a strong action verb
- Preserve ALL numbers, metrics, percentages, and technical keywords exactly
- If a target job role or description is provided, naturally incorporate relevant keywords without sounding forced.
- Use plain professional English (ATS-friendly)
- Do NOT add symbols, emojis, or special characters
- Do NOT add new information that wasn't in the original
- Do NOT change the meaning, only improve clarity and impact
- Return ONLY valid JSON in the EXACT same structure as the input

INPUT:
${JSON.stringify(inputData, null, 2)}

Return the enhanced version in the EXACT same JSON structure. Only change the text values.`;

    let lastError = '';
    for (const model of MODEL_FALLBACKS) {
      try {
        const response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://resumebuilderlab.com',
            'X-OpenRouter-Title': 'ResumeLab',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            top_p: 0.95,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) { lastError = await response.text(); continue; }
        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content?.trim() || '';

        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1].trim();

        try {
          const result = JSON.parse(jsonStr);
          return NextResponse.json({ enhanced: result, modelUsed: model });
        } catch {
          lastError = 'Invalid JSON response';
          continue;
        }
      } catch (err) {
        lastError = err.name === 'AbortError' || err.name === 'TimeoutError' ? `${model} timed out` : err.message;
        continue;
      }
    }

    // Last fallback: OpenAI GPT-4o-mini
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const openaiRes = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 2000,
          }),
        });

        if (openaiRes.ok) {
          const openaiPayload = await openaiRes.json();
          const openaiContent = openaiPayload?.choices?.[0]?.message?.content?.trim() || '';
          let jsonStr = openaiContent;
          const jsonMatch = openaiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) jsonStr = jsonMatch[1].trim();
          try {
            const result = JSON.parse(jsonStr);
            return NextResponse.json({ enhanced: result, modelUsed: 'gpt-4o-mini' });
          } catch {
            lastError = 'OpenAI returned invalid JSON';
          }
        } else {
          lastError = await openaiRes.text();
        }
      } catch (err) {
        lastError = err.name === 'AbortError' || err.name === 'TimeoutError'
          ? 'OpenAI request timed out'
          : err.message || 'OpenAI request failed';
      }
    }

    return NextResponse.json({ error: 'Enhancement failed', details: lastError }, { status: 500 });
  } catch (error) {
    console.error('[ai-enhance-all] error:', error);
    return NextResponse.json({ error: 'Enhancement failed', details: error?.message }, { status: 500 });
  }
}
