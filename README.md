# Resume Lab

A modern, AI-powered resume builder with real-time ATS scoring. Built with Next.js, React, and Tailwind CSS.

## Features

- **ATS-optimized templates** — professionally designed layouts that pass applicant tracking system scans
- **Real-time ATS scoring** — live score (0-100) that updates as you type, with category breakdowns and actionable recommendations
- **Job description matching** — paste any job description to get keyword analysis and see exactly what's missing from your resume
- **One-tap keyword application** — add missing keywords individually or bulk-apply them to your Skills section
- **AI enhancement** — rewrites your bullet points to be concise, impactful, and recruiter-ready with strong action verbs
- **AI suggestions** — generates relevant content for empty fields based on your role and project context
- **Smart resume import** — upload PDF or DOCX, AI extracts and maps content into the correct sections automatically
- **Undo support** — every AI action can be undone within seconds
- **Auto-save** — never lose progress, data persists across sessions
- **PDF & DOCX export** — download your polished resume in either format
- **Saved resumes** — previously downloaded resumes are saved to your account for future access

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| AI | OpenRouter API |
| PDF/DOCX Parsing | unpdf, pdfjs-dist, mammoth |
| PDF Generation | Puppeteer Core |
| DOCX Generation | docx |
| Payments | Cashfree |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
# Required: OPENROUTER_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, RAZORPAY keys

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI features |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |

## License

All rights reserved.
