module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './auth/**/*.html',
    './anki/**/*.html',
    './math/**/*.html',
    './assets/**/*.js',
    './*.js'
  ],
  theme: {
    extend: {
      colors: {
        error: '#ba1a1a',
        'inverse-primary': '#98d3bd',
        'surface-container-low': '#f9f1fd',
        'surface-container': '#f3ebf7',
        'on-primary-fixed-variant': '#125040',
        'primary-container': '#215c4b',
        'surface-tint': '#2f6857',
        'on-primary': '#ffffff',
        'on-primary-fixed': '#002118',
        'on-surface': '#1d1a22',
        'surface-bright': '#fef7ff',
        'on-tertiary-container': '#c8c5ca',
        'primary-fixed': '#b3efd8',
        surface: '#fef7ff',
        'tertiary-fixed': '#e4e1e7',
        'on-background': '#1d1a22',
        'outline-variant': '#bfc9c3',
        primary: '#004435',
        'surface-container-high': '#ede6f1',
        'inverse-surface': '#322f37',
        'tertiary-fixed-dim': '#c8c5cb',
        'on-error': '#ffffff',
        'on-surface-variant': '#404945',
        'on-primary-container': '#97d2bc',
        'surface-dim': '#dfd7e3',
        secondary: '#ae3200',
        'secondary-fixed-dim': '#ffb59e',
        background: '#fef7ff',
        'on-secondary-fixed-variant': '#852400',
        'on-tertiary': '#ffffff',
        'error-container': '#ffdad6',
        'on-secondary': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'secondary-fixed': '#ffdbd0',
        'on-tertiary-fixed': '#1b1b1f',
        'secondary-container': '#fe6432',
        'on-error-container': '#93000a',
        'on-tertiary-fixed-variant': '#47464b',
        'surface-variant': '#e7e0eb',
        tertiary: '#3b3b3f',
        'tertiary-container': '#535256',
        'inverse-on-surface': '#f6eefa',
        'on-secondary-fixed': '#3a0a00',
        'on-secondary-container': '#5b1600',
        'surface-container-highest': '#e7e0eb',
        outline: '#707974',
        'primary-fixed-dim': '#98d3bd'
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Manrope', 'Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
}
