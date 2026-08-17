'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ReviewUs({ compact = false }) {
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
      <div className={compact ? '' : 'mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[24px] pt-[28px] shadow-[var(--shadow-sm)] lg:hidden'}>
        <div className="flex flex-col items-center rounded-[20px] bg-[var(--card-bg)] p-[24px] shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#10b981]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="mt-[12px] text-[15px] font-bold text-[var(--text-dark)]">Thank you for your review!</p>
          <p className="mt-[4px] text-[12px] text-[var(--text-light)]">Your feedback helps us improve.</p>
        </div>
      </div>
    );
  }

  const content = (
    <div className="rounded-[20px] bg-[var(--card-bg)] p-[24px] shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-[6px] rounded-full bg-[rgba(16,185,129,0.08)] px-[12px] py-[5px] text-[11px] font-bold text-[#059669]">
          <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] fill-[#059669]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          Leave a Review
        </div>
      </div>

      <h3 className="mt-[14px] text-center text-[18px] font-bold text-[var(--text-dark)]">
        How was your experience?
      </h3>
      <p className="mt-[6px] text-center text-[12px] text-[var(--text-light)]">Your feedback helps others find ResumeLab</p>

      {/* Stars */}
      <div className="mt-[16px] flex justify-center gap-[6px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 active:scale-95"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {star <= (hovered || rating) ? (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ) : (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            )}
          </button>
        ))}
      </div>

      {/* Text input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your experience (optional)"
        maxLength={500}
        rows={3}
        className="mt-[16px] w-full rounded-[12px] border border-[color:var(--border)] bg-[var(--card-bg-soft)] px-[14px] py-[10px] text-[13px] text-[var(--text-dark)] placeholder-[var(--text-light)] outline-none focus:border-[#6C63FF] transition-colors"
      />

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!rating || submitting}
        className="mt-[14px] w-full rounded-[12px] bg-[linear-gradient(135deg,#059669_0%,#10b981_100%)] py-[12px] text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(5,150,105,0.2)] transition-all hover:shadow-[0_6px_18px_rgba(5,150,105,0.3)] disabled:opacity-50 disabled:shadow-none"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );

  // Compact mode: just the card (used inside FaqSection desktop slot)
  if (compact) return content;

  // Full section mode: used on mobile
  return (
    <section className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[28px] pt-[28px] shadow-[var(--shadow-sm)] lg:hidden">
      {content}
    </section>
  );
}
