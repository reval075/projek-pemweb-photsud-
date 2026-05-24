/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#9BB5D3',
        'primary-light': '#B8CCE1',
        'primary-dark': '#7A9CC0',
        'primary-50': '#F0F4F8',
        'primary-100': '#E1E9F1',
        'primary-200': '#C5D5E5',
        'primary-900': '#2C3E50',
        'accent': '#E8C44D',
        'accent-light': '#F2D877',
        'off-white': '#F8F9FC',
        'charcoal': '#2C3E50',
        'slate': '#4A5568',
        'beige': '#EEF2F7',
        'warm-grey': '#8E99A4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
