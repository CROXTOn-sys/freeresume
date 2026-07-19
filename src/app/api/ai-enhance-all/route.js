import { NextResponse } from 'next/server';
import { rateLimit } from '../../../lib/rate-limit.js';

const MODEL_FALLBACKS = [
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2.5-7b-instruct',
];

export async function POST(request) {
  const { success } = rateLimit(request, { limit: 3, windowMs: 60000 });
  if (!success) return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 500 });

  try {
    const body = await request.json();
    const { experience, projects, certifications, education } = body || {};

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

    const prompt = `You are a professional resume writer. Enhance the following resume text fields.

STRICT RULES:
- Each enhanced text MUST have the SAME word count as the original (±2 words maximum)
- Start each bullet with a strong action verb
- Preserve ALL numbers, metrics, percentages, and technical keywords exactly
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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout per model
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://resumelab.duckdns.org',
            'X-OpenRouter-Title': 'ResumeLab',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            top_p: 0.95,
            max_tokens: 2000,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

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
        lastError = err.name === 'AbortError' ? `${model} timed out` : err.message;
        continue;
      }
    }

    // Last fallback: OpenAI GPT-4o-mini
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const openaiController = new AbortController();
        const openaiTimeout = setTimeout(() => openaiController.abort(), 5000); // 5s for OpenAI
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
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
          signal: openaiController.signal,
        });
        clearTimeout(openaiTimeout);

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
        lastError = err.message || 'OpenAI request failed';
      }
    }

    return NextResponse.json({ error: 'Enhancement failed', details: lastError }, { status: 500 });
  } catch (error) {
    console.error('[ai-enhance-all] error:', error);
    return NextResponse.json({ error: 'Enhancement failed', details: error?.message }, { status: 500 });
  }
}
