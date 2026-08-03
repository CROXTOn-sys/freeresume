'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ReviewUs() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ rating, text: text.trim() }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[24px] pt-[28px] shadow-[var(--shadow-sm)]">
        <div className="flex flex-col items-center">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#10b981]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="mt-[12px] text-[15px] font-bold text-[var(--text-dark)]">Thank you for your review!</p>
          <p className="mt-[4px] text-[12px] text-[#888]">Your feedback helps us improve.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[24px] pt-[28px] shadow-[var(--shadow-sm)] lg:mt-[0px] lg:px-[64px] lg:pb-[40px] lg:pt-[40px] lg:rounded-none lg:mx-0">
      <div className="lg:max-w-[520px] lg:mx-auto">
      <h2 className="mb-[16px] text-center text-[20px] font-extrabold tracking-[-0.03em] text-[var(--text-dark)] lg:text-[24px]">
        Review Us
      </h2>
      <p className="mb-[18px] text-center text-[13px] text-[#888]">How was your experience with ResumeLab?</p>

      {/* Stars */}
      <div className="flex justify-center gap-[8px] mb-[16px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-[32px] transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {star <= (hovered || rating) ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            )}
          </button>
        ))}
      </div>

      {/* Text input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell us about your experience (optional)"
        maxLength={500}
        rows={3}
        className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] py-[10px] text-[14px] text-black placeholder-[#aaa] outline-none focus:border-[#6C63FF]"
      />

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!rating || submitting}
        className="mt-[14px] w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
      </div>
    </section>
  );
}
