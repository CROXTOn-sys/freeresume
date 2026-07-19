import { NextResponse } from 'next/server';
import { rateLimit } from '../../../lib/rate-limit.js';

const MODEL_FALLBACKS = [
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2.5-7b-instruct',
];

export async function POST(request) {
  const { success } = rateLimit(request, { limit: 10, windowMs: 60000 });
  if (!success) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 500 });

  try {
    const body = await request.json();
    const { context, fieldType } = body;

    if (!context || !context.trim()) {
      return NextResponse.json({ error: 'Need context (title/role) to generate suggestion' }, { status: 400 });
    }

    const prompts = {
      experience_bullet: `You are a resume writer. Based on the role "${context}", generate ONE professional resume bullet point. Start with a strong action verb. Keep it under 25 words. Include a measurable outcome if possible. Return ONLY the bullet text, no quotes, no dash, no prefix.`,
      project_bullet: `You are a resume writer. Based on the project "${context}", generate ONE professional resume bullet point describing what was built or achieved. Keep it under 25 words. Return ONLY the bullet text, no quotes, no dash, no prefix.`,
      project_description: `You are a resume writer. Based on the project "${context}", generate a ONE sentence project description (what it does, tools used, outcome). Keep it under 30 words. Return ONLY the description text, no quotes.`,
      certification_description: `You are a resume writer. Based on the certification "${context}", generate ONE sentence describing what was learned or achieved. Keep it under 20 words. Return ONLY the text, no quotes.`,
      summary: `You are a resume writer. Based on the professional title "${context}", generate a 2-3 sentence professional summary for a resume. Keep it ATS-friendly and under 50 words. Return ONLY the summary text, no quotes.`,
      coursework: `Based on the degree "${context}", suggest 5-6 relevant courses separated by commas. Return ONLY the course names, no numbering.`,
    };

    const prompt = prompts[fieldType] || prompts.experience_bullet;

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
            temperature: 0.7,
            max_tokens: 150,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) { lastError = await response.text(); continue; }
        const payload = await response.json();
        const text = payload?.choices?.[0]?.message?.content?.trim() || '';
        if (text) return NextResponse.json({ suggestion: text, modelUsed: model });
        lastError = 'Empty response';
      } catch (err) {
        lastError = err.name === 'AbortError' ? `${model} timed out` : err.message;
        continue;
      }
    }

    // OpenAI fallback
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 150 }),
      });
      if (openaiRes.ok) {
        const p = await openaiRes.json();
        const text = p?.choices?.[0]?.message?.content?.trim() || '';
        if (text) return NextResponse.json({ suggestion: text, modelUsed: 'gpt-4o-mini' });
      }
    }

    return NextResponse.json({ error: 'Suggestion failed', details: lastError }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: 'Suggestion failed' }, { status: 500 });
  }
}
