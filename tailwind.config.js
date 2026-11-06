/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        'serif-display': ['var(--font-newsreader)', 'Georgia', 'serif'],
        heading: ['var(--font-plus-jakarta-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: 'var(--primary)',
          secondary: 'var(--primary-2)',
          soft: 'var(--primary-soft)',
        },
        canvas: 'var(--bg)',
        'canvas-subtle': 'var(--bg-subtle)',
        surface: 'var(--surface)',
        ink: 'var(--text)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      boxShadow: {
        'surface-sm': 'var(--shadow-sm)',
        'surface-md': 'var(--shadow-md)',
        'surface-lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};
