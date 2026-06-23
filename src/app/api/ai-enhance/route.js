import { NextResponse } from 'next/server';

const MODEL_FALLBACKS = [
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2.5-7b-instruct',
];

function buildPrompt({ section, text, context }) {
  const sectionPrompts = {
    summary:
      'Rewrite this resume summary to sound natural, confident, and ATS-friendly. Expand short text into a strong professional summary of about 3 to 4 lines, roughly 45 to 60 pixels of visual space on the page. If the input is very short, make it feel complete and resume-ready by adding relevant professional context, strengths, and focus areas without inventing facts. Keep it specific, avoid repetition, and make it sound like a real human professional wrote it. If needed, use two well-formed sentences instead of one short sentence so the block feels properly filled.',
    experience_bullet:
      'Rewrite this resume experience bullet to sound action-oriented, specific, and measurable. If the input is short or sentence-like, break it into 2 to 4 concise resume bullet points when helpful, or expand it into a stronger 1 to 2 line bullet that includes action, impact, and relevant tools or context when possible. Aim to fill about 9 to 12% of the experience-entry body area with each bullet block. Make it complete enough to look like a real resume bullet, but do not invent achievements or numbers. Keep it natural and avoid vague wording. If the section still looks thin, favor adding a second concise clause rather than leaving the line too short.',
    project_bullet:
      'Rewrite this resume project bullet to sound clear, impactful, and concise. If the input is short or sentence-like, break it into 2 to 4 concise resume bullet points when helpful, or expand it into a stronger 1 to 2 line bullet that includes the project goal, tools used, and outcome when possible. Aim to fill about 9 to 12% of the project-entry body area with each bullet block. Make it detailed enough to help the project section look balanced on the page, while staying truthful and concise. If the section still looks thin, favor adding a second concise clause rather than leaving the line too short.',
    issuer:
      'Rewrite this certification issuer line so it reads cleanly and professionally. Keep it short, exact, and natural, like an official issuer name.',
  };

  const baseInstruction = sectionPrompts[section] || 'Rewrite this text professionally.';

  const styleGuidance = {
    summary:
      'If the text is too short, expand it to a complete summary of roughly 3 to 4 lines. If it is too long, compress it without losing meaning. Aim for a balanced A4 resume layout and a polished ATS-friendly tone. When the block is visibly short, prefer fuller sentences over fragments.',
    experience_bullet:
      'Prefer strong verbs, one achievement, one concrete outcome, and relevant tools or context when possible. Keep the bullet long enough to look complete, but not so long that it overwhelms the page. If the input is very short, it can be expanded into multiple bullets under the same role. Two to four lines per role is a good practical target. Aim for a fuller block that occupies most of the allotted experience area.',
    project_bullet:
      'Mention the task, tools, and result when possible. Keep the bullet full enough to support the A4 layout, but still concise and recruiter-friendly. When the input is very short, expand it to a more complete project bullet or multiple bullets under the same project. Two to four lines per project is a good practical target. Aim for a fuller block that occupies most of the allotted project area.',
    issuer:
      'Do not add extra words beyond the issuer name unless needed for clarity.',
  }[section] || 'Keep the meaning intact while improving readability.';

  return `${baseInstruction}

Style guidance:
${styleGuidance}

Context:
${context || 'No extra context provided.'}

Text:
${text}

Return only the rewritten text. Do not add quotes, bullets, labels, markdown, or extra commentary.`;
}

function extractText(payload) {
  const candidates = payload?.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts || [];
    for (const part of parts) {
      if (typeof part?.text === 'string' && part.text.trim()) {
        return part.text.trim();
      }
    }
  }
  return '';
}

export async function POST(request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('[ai-enhance] env status', {
    hasOpenRouterApiKey: Boolean(apiKey),
    openRouterApiKeyLength: apiKey ? apiKey.length : 0,
    modelFallbacks: MODEL_FALLBACKS,
  });

  try {
    if (!apiKey) {
      console.error('[ai-enhance] Missing OPENROUTER_API_KEY');
      return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    const body = await request.json();
    const { section, text, context } = body || {};

    console.log('[ai-enhance] incoming payload', {
      section,
      textLength: typeof text === 'string' ? text.length : 0,
      contextLength: typeof context === 'string' ? context.length : 0,
      textPreview: typeof text === 'string' ? text.slice(0, 120) : '',
      contextPreview: typeof context === 'string' ? context.slice(0, 120) : '',
    });

    if (!section || !text || !String(text).trim()) {
      return NextResponse.json({ error: 'Missing text to enhance' }, { status: 400 });
    }

    const prompt = buildPrompt({
      section,
      text: String(text).trim(),
      context: typeof context === 'string' ? context : '',
    });

    let lastErrorDetails = '';
    let lastErrorStatus = 500;
    let lastErrorPayload = null;

    for (const model of MODEL_FALLBACKS) {
      console.log('[ai-enhance] selected model', { model });

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3006',
          'X-OpenRouter-Title': 'resume.com',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.4,
          top_p: 0.95,
          max_tokens: 256,
        }),
      });

      console.log('[ai-enhance] openrouter response', {
        model,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorPayload = errorText;

        try {
          errorPayload = JSON.parse(errorText);
        } catch {
          // Keep the raw text if it is not JSON.
        }

        lastErrorStatus = response.status;
        lastErrorPayload = errorPayload;
        lastErrorDetails =
          typeof errorPayload === 'string'
            ? errorPayload
            : JSON.stringify(errorPayload);

        console.error('[ai-enhance] openrouter error message', {
          model,
          status: response.status,
          statusText: response.statusText,
          errorPayload,
        });
        continue;
      }

      const payload = await response.json();
      console.log('[ai-enhance] openrouter response payload', payload);
      const enhancedText = payload?.choices?.[0]?.message?.content?.trim?.() || '';

      if (enhancedText) {
        return NextResponse.json({ text: enhancedText, modelUsed: model });
      }

      lastErrorDetails = 'No enhanced text returned';
      lastErrorPayload = payload;
      console.error('[ai-enhance] No enhanced text returned', { model, payload });
    }

    return NextResponse.json(
      {
        error: 'OpenRouter request failed',
        details: lastErrorDetails || 'All fallback models failed',
        openrouterError: lastErrorPayload,
      },
      { status: lastErrorStatus }
    );
  } catch (error) {
    console.error('[ai-enhance] stack trace', error?.stack || error);
    return NextResponse.json(
      { error: 'Enhancement failed', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
