window.SC_GOOGLE_CALENDAR_CONFIG = Object.assign(
  {
    clientId: '',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    calendarId: 'primary',
    timeMinOffsetDays: -30,
    timeMaxOffsetDays: 120
  },
  window.SC_GOOGLE_CALENDAR_CONFIG || {}
);
