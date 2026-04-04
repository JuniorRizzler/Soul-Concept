(function () {
  var PROFILE_KEY = 'sc_engagement_profile_v1'
  var LESSON_KEY = 'sc_engagement_lesson_progress_v1'
  var DISMISS_KEY = 'sc_engagement_onboarding_dismissed_v1'
  var FLOW_KEY = 'sc_dashboard_completed_flow_v1'
  var SCHEDULE_KEY = 'sc_schedule_events_v2'
  var PANELS_ENABLED = false
  var initialized = false

  var SUBJECT_LIBRARY_MAP = {
    Science: 'study-library.html',
    Geography: 'geography-library.html',
    Mathematics: 'grade-10-math.html',
    Math: 'grade-10-math.html',
    English: 'subject-library.html',
    French: 'subject-library.html',
    Spanish: 'subject-library.html',
    History: 'subject-library.html'
  }

  var SUBJECT_RELATED_MAP = {
    Science: 'Geography',
    Geography: 'Science',
    Mathematics: 'Science',
    Math: 'Science',
    English: 'History',
    History: 'English',
    French: 'English',
    Spanish: 'English'
  }

  var GRADE_OPTIONS = [
    { value: 'Grade 9', icon: 'rocket_launch', label: 'Grade 9', note: 'Build foundations and strong habits.' },
    { value: 'Grade 10', icon: 'flare', label: 'Grade 10', note: 'Balance skill growth with sharper exam prep.' },
    { value: 'Grade 11', icon: 'timeline', label: 'Grade 11', note: 'Increase rigor and consistency across courses.' },
    { value: 'Grade 12', icon: 'military_tech', label: 'Grade 12', note: 'Push for final performance and exam readiness.' }
  ]

  var SUBJECT_OPTIONS = [
    { value: 'Science', icon: 'biotech', note: 'Labs, systems, and concept retention.' },
    { value: 'Geography', icon: 'public', note: 'Case studies, mapping, and applied thinking.' },
    { value: 'Mathematics', icon: 'functions', note: 'Practice flow, mastery, and review speed.' },
    { value: 'English', icon: 'menu_book', note: 'Reading, analysis, and stronger written responses.' },
    { value: 'French', icon: 'translate', note: 'Vocabulary, writing, and fluency support.' },
    { value: 'Spanish', icon: 'language', note: 'Speaking confidence and pattern repetition.' }
  ]

  var GOAL_OPTIONS = [
    { value: 'consistency', icon: 'event_repeat', label: 'Build Consistency', note: 'Steady targets and cleaner routines.' },
    { value: 'exam-prep', icon: 'workspace_premium', label: 'Prepare for Exams', note: 'Sharper countdown planning and review pressure.' },
    { value: 'confidence', icon: 'psychology', label: 'Boost Confidence', note: 'More guided wins and lower-friction starts.' },
    { value: 'speed', icon: 'bolt', label: 'Practice Faster', note: 'Quicker reps, shorter loops, less hesitation.' },
    { value: 'mastery', icon: 'library_books', label: 'Go Deeper', note: 'Concept links, richer explanations, harder follow-ups.' }
  ]

  function readAuthProfile() {
    try {
      var raw = localStorage.getItem('sc_auth_profile_v1')
      return raw ? JSON.parse(raw) : null
    } catch (_err) {
      return null
    }
  }

  function scopeSuffix() {
    var auth = readAuthProfile()
    return auth && (auth.id || auth.email) ? String(auth.id || auth.email) : 'guest'
  }

  function scopedKey(base) {
    return base + '::' + scopeSuffix()
  }

  function readJson(base, fallback) {
    try {
      var scopedRaw = localStorage.getItem(scopedKey(base))
      if (scopedRaw != null) return JSON.parse(scopedRaw)
      var raw = localStorage.getItem(base)
      return raw != null ? JSON.parse(raw) : fallback
    } catch (_err) {
      return fallback
    }
  }

  function writeJson(base, value) {
    try {
      localStorage.setItem(scopedKey(base), JSON.stringify(value))
    } catch (_err) {}
  }

  function dispatchUpdate() {
    window.dispatchEvent(new CustomEvent('sc:engagement-updated'))
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function titleCase(value) {
    return String(value || '').replace(/\b\w/g, function (char) { return char.toUpperCase() })
  }

  function subjectLabel(value) {
    if (!value) return 'Science'
    if (value === 'Math') return 'Mathematics'
    return value
  }

  function uniqueList(items) {
    var seen = {}
    return (items || []).filter(function (item) {
      var key = String(item || '').trim().toLowerCase()
      if (!key || seen[key]) return false
      seen[key] = true
      return true
    })
  }

  function parseDate(value) {
    if (!value) return null
    if (value instanceof Date) return value
    var parsed = new Date(String(value) + 'T00:00:00')
    return isNaN(parsed.getTime()) ? null : parsed
  }

  function formatDate(value) {
    var date = parseDate(value)
    if (!date) return 'No exam date yet'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  function startOfWeek(date) {
    var copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    var day = copy.getDay()
    var diff = day === 0 ? -6 : 1 - day
    copy.setDate(copy.getDate() + diff)
    copy.setHours(0, 0, 0, 0)
    return copy
  }

  function endOfWeek(date) {
    var copy = startOfWeek(date)
    copy.setDate(copy.getDate() + 6)
    copy.setHours(23, 59, 59, 999)
    return copy
  }

  function isSameWeek(dateA, dateB) {
    var aStart = startOfWeek(dateA)
    var bStart = startOfWeek(dateB)
    return aStart.getTime() === bStart.getTime()
  }

  function daysUntil(value) {
    var date = parseDate(value)
    if (!date) return null
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.round((date.getTime() - today.getTime()) / 86400000)
  }

  function getCurrentPath() {
    var path = window.location.pathname || ''
    var clean = path.replace(/\\/g, '/')
    return clean.slice(clean.lastIndexOf('/') + 1) || 'index.html'
  }

  function detectContext() {
    var path = getCurrentPath()
    if (path === 'index.html' || path === '') {
      return { page: 'home', subject: null, grade: null, showLibraryRail: false }
    }
    if (path === 'dashboard.html') {
      return { page: 'dashboard', subject: null, grade: null, showLibraryRail: false }
    }
    if (path === 'profile.html') {
      return { page: 'profile', subject: null, grade: null, showLibraryRail: false }
    }
    if (path === 'subject-library.html') {
      return { page: 'library', subject: null, grade: null, showLibraryRail: true, libraryLabel: 'Subject Library' }
    }
    if (path === 'study-library.html') {
      return { page: 'library', subject: 'Science', grade: 'Grade 9', showLibraryRail: true, libraryLabel: 'Science Library' }
    }
    if (path === 'geography-library.html') {
      return { page: 'library', subject: 'Geography', grade: 'Grade 9', showLibraryRail: true, libraryLabel: 'Geography Library' }
    }
    if (path === 'grade-10-math.html') {
      return { page: 'library', subject: 'Mathematics', grade: 'Grade 10', showLibraryRail: true, libraryLabel: 'Math Library' }
    }
    return { page: 'generic', subject: null, grade: null, showLibraryRail: false }
  }

  function readEngagementProfile() {
    var saved = readJson(PROFILE_KEY, null)
    if (!saved) return null
    saved.subjects = uniqueList(saved.subjects || [])
    saved.goals = uniqueList(saved.goals || [])
    return saved
  }

  function saveEngagementProfile(profile) {
    var normalized = {
      grade: profile.grade || '',
      subjects: uniqueList(profile.subjects || []),
      goals: uniqueList(profile.goals || []),
      examDate: profile.examDate || '',
      completedAt: new Date().toISOString()
    }
    writeJson(PROFILE_KEY, normalized)
    try {
      localStorage.removeItem(scopedKey(DISMISS_KEY))
    } catch (_err) {}
    dispatchUpdate()
    return normalized
  }

  function readWeeklyLessons() {
    return readJson(LESSON_KEY, [])
  }

  function trackLessonOpen(subject, lessonId, lessonTitle) {
    var items = readWeeklyLessons()
    var now = new Date()
    var filtered = items.filter(function (entry) {
      var entryDate = new Date(entry.openedAt)
      return !isNaN(entryDate.getTime()) && isSameWeek(entryDate, now)
    })
    var key = String(lessonId || '')
    var existingIndex = -1
    filtered.forEach(function (entry, index) {
      if (entry.id === key) existingIndex = index
    })
    var payload = {
      id: key,
      title: lessonTitle || 'Lesson',
      subject: subjectLabel(subject),
      openedAt: now.toISOString()
    }
    if (existingIndex === -1) filtered.push(payload)
    else filtered[existingIndex] = payload
    writeJson(LESSON_KEY, filtered)
    dispatchUpdate()
  }

  function readScheduleEvents() {
    return readJson(SCHEDULE_KEY, [])
  }

  function countWeeklySessions() {
    var today = new Date()
    var weekStart = startOfWeek(today)
    var weekEnd = endOfWeek(today)
    return readScheduleEvents().filter(function (entry) {
      var date = parseDate(entry && entry.date)
      return date && date.getTime() >= weekStart.getTime() && date.getTime() <= weekEnd.getTime() && date.getTime() <= today.getTime()
    }).length
  }

  function countWeeklyLessons(subject) {
    var normalized = subjectLabel(subject)
    return readWeeklyLessons().filter(function (entry) {
      return subjectLabel(entry.subject) === normalized
    }).length
  }

  function reviewProgressPercent() {
    var completed = readJson(FLOW_KEY, [])
    return Math.max(0, Math.min(100, (completed.length || 0) * 20))
  }

  function routeForLibrary(subject) {
    return SUBJECT_LIBRARY_MAP[subjectLabel(subject)] || 'subject-library.html'
  }

  function routeForQuiz(_subject) {
    return 'math-quiz-simulator.html'
  }

  function routeForFlashcards(_subject) {
    return 'anki/index.html'
  }

  function relatedSubjectFor(subject, profile) {
    var current = subjectLabel(subject)
    var preferred = profile && profile.subjects && profile.subjects.filter(function (item) {
      return subjectLabel(item) !== current
    })[0]
    return subjectLabel(preferred || SUBJECT_RELATED_MAP[current] || 'Science')
  }

  function goalCopyLabel(goal) {
    var labels = {
      consistency: 'Consistency',
      'exam-prep': 'Exam Prep',
      confidence: 'Confidence',
      speed: 'Speed',
      mastery: 'Mastery'
    }
    return labels[goal] || 'Progress'
  }

  function formatEventDateTime(entry) {
    if (!entry || !entry.date) return 'No study session scheduled'
    var date = parseDate(entry.date)
    if (!date) return 'No study session scheduled'
    var time = entry.start ? String(entry.start) : ''
    var parts = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    return time ? parts + ' at ' + time : parts
  }

  function getUpcomingEvents() {
    var now = new Date()
    return readScheduleEvents().filter(function (entry) {
      var date = parseDate(entry && entry.date)
      return date && date.getTime() >= startOfWeek(now).getTime()
    }).sort(function (a, b) {
      var aKey = (a.date || '') + ' ' + (a.start || '00:00')
      var bKey = (b.date || '') + ' ' + (b.start || '00:00')
      return aKey.localeCompare(bKey)
    })
  }

  function buildEngagementState(context, profile) {
    var subject = subjectLabel(
      context.subject ||
      (profile && profile.subjects && profile.subjects[0]) ||
      'Science'
    )
    var goal = (profile && profile.goals && profile.goals[0]) || 'consistency'
    var sessionCount = countWeeklySessions()
    var lessonCount = countWeeklyLessons(subject)
    var reviewPercent = reviewProgressPercent()
    var examCountdown = daysUntil(profile && profile.examDate)
    var upcoming = getUpcomingEvents()[0] || null
    return {
      subject: subject,
      grade: (profile && profile.grade) || context.grade || 'Grade 9',
      goal: goal,
      goalLabel: goalCopyLabel(goal),
      sessionCount: sessionCount,
      lessonCount: lessonCount,
      reviewPercent: reviewPercent,
      examCountdown: examCountdown,
      examDateLabel: profile && profile.examDate ? formatDate(profile.examDate) : 'No exam date',
      relatedSubject: relatedSubjectFor(subject, profile),
      upcomingEvent: upcoming,
      upcomingEventLabel: formatEventDateTime(upcoming),
      libraryHref: routeForLibrary(subject),
      relatedHref: routeForLibrary(relatedSubjectFor(subject, profile)),
      quizHref: routeForQuiz(subject),
      cardsHref: routeForFlashcards(subject),
      activeSubjects: uniqueList((profile && profile.subjects) || [])
    }
  }

  function buildRecommendations(context, profile, options) {
    var state = buildEngagementState(context, profile)
    var currentPath = getCurrentPath()
    var cards = []

    if (options && typeof options.nextLessonIndex === 'number') {
      cards.push({
        type: 'Next Lesson',
        title: 'Continue the next geography lesson',
        copy: 'You already opened this topic, so the cleanest next step is the next lesson while the material is still fresh.',
        actionText: 'Open Lesson',
        lessonIndex: options.nextLessonIndex
      })
    } else if (context.page === 'library' && context.subject) {
      cards.push({
        type: 'Next Lesson',
        title: state.lessonCount > 0 ? 'Keep building inside ' + context.libraryLabel : 'Start the first ' + state.subject + ' lesson',
        copy: state.lessonCount > 0
          ? 'You have already opened ' + state.lessonCount + ' ' + state.subject.toLowerCase() + ' lesson' + (state.lessonCount === 1 ? '' : 's') + ' this week. Stay in the same library and move one step deeper.'
          : 'Nothing has been opened in this subject yet this week, so start with the first lesson before switching modes.',
        actionText: 'Open Library',
        href: state.libraryHref
      })
    } else {
      cards.push({
        type: 'Next Lesson',
        title: state.lessonCount > 0 ? 'Return to your ' + state.subject + ' library' : 'Open your first ' + state.subject + ' lesson',
        copy: state.lessonCount > 0
          ? 'Your current profile points back to ' + state.subject + ', and that is where your tracked lesson progress already lives.'
          : 'Your profile is weighted toward ' + state.subject + ', so that is the best place to start this week.',
        actionText: 'Open Library',
        href: state.libraryHref
      })
    }

    cards.push({
      type: 'Related Subject',
      title: 'Switch to ' + state.relatedSubject + ' without losing momentum',
      copy: state.activeSubjects.length > 1
        ? 'You selected ' + state.relatedSubject + ' in your study plan, so this is the strongest subject shift when you want variety without starting cold.'
        : state.relatedSubject + ' is the closest adjacent route after ' + state.subject + ', so it keeps the session moving without changing the rhythm too much.',
      actionText: 'Open ' + state.relatedSubject,
      href: state.relatedHref
    })

    cards.push({
      type: 'Practice Quiz',
      title: state.reviewPercent >= 50 ? 'Check your retention with the quiz flow' : 'Use a quick quiz to raise your review score',
      copy: state.reviewPercent >= 50
        ? 'Your review flow is already moving, so a short quiz is the fastest way to confirm what is sticking before you leave.'
        : 'Your review flow is only at ' + state.reviewPercent + '%, so the quiz route gives you a fast score checkpoint and a clear next target.',
      actionText: 'Open Quiz',
      href: state.quizHref
    })

    cards.push({
      type: 'Review Flashcards',
      title: state.lessonCount > 0 ? 'Reinforce ' + state.subject + ' with active recall' : 'Prime the topic with a fast recall round',
      copy: state.lessonCount > 0
        ? 'You already opened lesson content this week, which makes flashcards the best follow-up if you want the session to end with retrieval instead of more reading.'
        : 'If you are not opening a lesson right now, flashcards are the fastest way to keep the subject active and still record a useful review action.',
      actionText: 'Open Cards',
      href: state.cardsHref
    })

    return cards.map(function (item) {
      item.pagePath = currentPath
      item.subject = state.subject
      return item
    })
  }

  function buildDailyFocus(context, profile) {
    var state = buildEngagementState(context, profile)
    var headline = 'Start with ' + state.subject + ' and close one real loop.'
    var copy = 'Open the best-fit library for your plan, complete one lesson or one review action, and leave with progress that actually changes the next recommendation.'

    if (context.page === 'library' && context.subject) {
      headline = 'Stay inside ' + context.libraryLabel + ' while the context is already loaded.'
      copy = state.lessonCount > 0
        ? 'You already opened ' + state.lessonCount + ' ' + state.subject.toLowerCase() + ' lesson' + (state.lessonCount === 1 ? '' : 's') + ' this week. Keep the same subject open and use this session to move one step deeper.'
        : 'You are already in the right place. Open the first lesson here, then use cards or a quiz only after the lesson is logged.'
    } else if (state.examCountdown != null && state.examCountdown >= 0 && state.examCountdown <= 14) {
      headline = state.subject + ' exam window is close.'
      copy = 'Your exam date is set for ' + state.examDateLabel + '. Today should be one lesson, one review action, and nothing extra so the work stays repeatable.'
    } else if (state.sessionCount === 0) {
      headline = 'This week has not started yet.'
      copy = 'There are no logged study sessions for this week, so the highest-value move is a short ' + state.subject.toLowerCase() + ' block that gives the dashboard something real to build from.'
    } else if (state.lessonCount === 0) {
      headline = 'Sessions exist, but ' + state.subject + ' still needs a lesson open.'
      copy = 'You have study activity this week, but no tracked ' + state.subject.toLowerCase() + ' lessons yet. Open one lesson first, then switch modes only after that step is recorded.'
    } else if (state.reviewPercent < 40) {
      headline = state.subject + ' content is moving. Review is the weak spot.'
      copy = 'Lesson activity is already in place, but review flow is only at ' + state.reviewPercent + '%. Use this visit to raise retention instead of opening another unrelated page.'
    } else if (state.upcomingEvent) {
      headline = 'The next scheduled study block is already on the board.'
      copy = 'Your next session is ' + state.upcomingEventLabel + '. Use this page to prepare the subject you are most likely to continue when that block starts.'
    }

    var recommendations = buildRecommendations(context, profile)
    var secondaryAction = state.upcomingEvent
      ? { actionText: 'Open Schedule', href: 'schedule.html' }
      : recommendations[1]

    return {
      headline: headline,
      copy: copy,
      subject: state.subject,
      actions: [
        recommendations[0],
        secondaryAction
      ],
      pills: [
        state.grade,
        state.subject,
        state.goalLabel
      ],
      stats: [
        {
          label: 'Sessions',
          value: state.sessionCount,
          note: 'logged this week'
        },
        {
          label: 'Lessons',
          value: state.lessonCount,
          note: state.subject.toLowerCase() + ' opens tracked'
        },
        {
          label: state.examCountdown != null && state.examCountdown >= 0 ? 'Exam' : 'Review',
          value: state.examCountdown != null && state.examCountdown >= 0 ? state.examDateLabel : state.reviewPercent + '%',
          note: state.examCountdown != null && state.examCountdown >= 0 ? 'target date' : 'current review flow'
        }
      ]
    }
  }

  function buildWeeklyGoals(context, profile) {
    var state = buildEngagementState(context, profile)
    var targetsByGoal = {
      consistency: { sessions: 4, lessons: 2, review: 45 },
      'exam-prep': { sessions: 5, lessons: 3, review: 80 },
      confidence: { sessions: 3, lessons: 2, review: 55 },
      speed: { sessions: 4, lessons: 2, review: 60 },
      mastery: { sessions: 4, lessons: 3, review: 70 }
    }
    var targets = targetsByGoal[state.goal] || targetsByGoal.consistency

    return [
      {
        label: 'Log ' + targets.sessions + ' study sessions',
        progress: state.sessionCount,
        target: targets.sessions,
        valueLabel: state.sessionCount + ' / ' + targets.sessions + ' sessions',
        copy: state.sessionCount >= targets.sessions
          ? 'This target is already cleared. Keep the next session focused on depth instead of just adding another block.'
          : 'Schedule and quick study blocks both count here, so this target moves only when the week has real study time attached to it.'
      },
      {
        label: 'Open ' + targets.lessons + ' ' + state.subject.toLowerCase() + ' lessons',
        progress: state.lessonCount,
        target: targets.lessons,
        valueLabel: state.lessonCount + ' / ' + targets.lessons + ' lesson opens',
        copy: 'This goal is based on tracked lesson opens, not fake completion data, so it reflects what the site can actually verify today.'
      },
      {
        label: 'Reach ' + targets.review + '% review flow',
        progress: state.reviewPercent,
        target: targets.review,
        valueLabel: state.reviewPercent + '% / ' + targets.review + '%',
        copy: 'Completed due-today items feed this score, which keeps the dashboard pointing back to unfinished review instead of inventing progress.'
      }
    ].map(function (goal) {
      goal.percent = Math.max(0, Math.min(100, Math.round((goal.progress / goal.target) * 100)))
      return goal
    })
  }

  function actionMarkup(action, variant) {
    if (action.lessonIndex != null) {
      return '<button class="sc-engagement-button" data-variant="' + (variant || 'primary') + '" data-engagement-open-lesson="' + action.lessonIndex + '" type="button">' + action.actionText + '</button>'
    }
    return '<a class="sc-engagement-button" data-variant="' + (variant || 'primary') + '" href="' + action.href + '">' + action.actionText + '</a>'
  }

  function focusMarkup(focus) {
    return (
      '<div class="sc-engagement-primary">' +
        '<span class="sc-engagement-kicker"><span class="material-symbols-outlined">bolt</span>Today\'s Focus</span>' +
        '<h2 class="sc-engagement-title">' + focus.headline + '</h2>' +
        '<p class="sc-engagement-copy">' + focus.copy + '</p>' +
        '<div class="sc-engagement-pills">' +
          focus.pills.map(function (pill) {
            return '<span class="sc-engagement-pill">' + pill + '</span>'
          }).join('') +
        '</div>' +
        '<div class="sc-engagement-metrics">' +
          focus.stats.map(function (item) {
            return (
              '<div class="sc-engagement-metric">' +
                '<span class="sc-engagement-metric-label">' + item.label + '</span>' +
                '<strong class="sc-engagement-metric-value">' + item.value + '</strong>' +
                '<span class="sc-engagement-metric-note">' + item.note + '</span>' +
              '</div>'
            )
          }).join('') +
        '</div>' +
        '<div class="sc-engagement-actions">' +
          focus.actions.map(function (action, index) {
            return actionMarkup(action, index === 0 ? 'primary' : 'secondary')
          }).join('') +
          '<button class="sc-engagement-button" data-variant="ghost" data-engagement-open-onboarding="true" type="button">Edit Study Plan</button>' +
        '</div>' +
      '</div>'
    )
  }

  function goalsMarkup(goals, heading, copy) {
    return (
      '<div class="sc-engagement-focus-card">' +
        '<h3 class="sc-engagement-side-title">' + heading + '</h3>' +
        '<p class="sc-engagement-section-copy">' + copy + '</p>' +
        '<div class="sc-engagement-goals">' +
          goals.map(function (goal) {
            return (
              '<div class="sc-engagement-goal-card">' +
                '<div class="sc-engagement-goal-meta">' +
                  '<span class="sc-engagement-goal-label">' + goal.label + '</span>' +
                  '<span class="sc-engagement-goal-value">' + goal.valueLabel + '</span>' +
                '</div>' +
                '<div class="sc-engagement-progress"><span style="width:' + goal.percent + '%"></span></div>' +
                '<p class="sc-engagement-section-copy">' + goal.copy + '</p>' +
              '</div>'
            )
          }).join('') +
        '</div>' +
      '</div>'
    )
  }

  function recommendationsMarkup(cards, heading, copy) {
    return (
      '<div class="sc-engagement-focus-card">' +
        '<h3 class="sc-engagement-side-title">' + heading + '</h3>' +
        '<p class="sc-engagement-section-copy">' + copy + '</p>' +
        '<div class="sc-engagement-next-grid">' +
          cards.map(function (card) {
            if (card.lessonIndex != null) {
              return (
                '<button class="sc-engagement-next-card" data-actionable="true" data-engagement-open-lesson="' + card.lessonIndex + '" type="button">' +
                  '<span class="sc-engagement-next-type">' + card.type + '</span>' +
                  '<h4 class="sc-engagement-next-heading">' + card.title + '</h4>' +
                  '<p class="sc-engagement-next-copy">' + card.copy + '</p>' +
                  '<span class="sc-engagement-next-footer">' + card.actionText + ' <span class="material-symbols-outlined">arrow_forward</span></span>' +
                '</button>'
              )
            }
            return (
              '<a class="sc-engagement-next-card" href="' + card.href + '">' +
                '<span class="sc-engagement-next-type">' + card.type + '</span>' +
                '<h4 class="sc-engagement-next-heading">' + card.title + '</h4>' +
                '<p class="sc-engagement-next-copy">' + card.copy + '</p>' +
                '<span class="sc-engagement-next-footer">' + card.actionText + ' <span class="material-symbols-outlined">arrow_forward</span></span>' +
              '</a>'
            )
          }).join('') +
        '</div>' +
      '</div>'
    )
  }

  function panelMarkup(type, context, profile, options) {
    var focus = buildDailyFocus(context, profile || {})
    var goals = buildWeeklyGoals(context, profile || {})
    var recs = buildRecommendations(context, profile || {}, options)
    var heading = 'Recommended Next'
    var copy = 'Keep one useful step visible so the page always points to a real next action.'

    if (type === 'library') {
      heading = 'Keep This Session Moving'
      copy = 'These routes use the subject you are already in plus your saved study profile, so the next click is tied to actual work rather than generic exploration.'
    } else if (type === 'profile') {
      heading = 'Your Study Blueprint'
      copy = 'Your grade, subjects, and current targets shape these recommendations so the profile page reflects the plan instead of just repeating it.'
    } else if (type === 'dashboard') {
      heading = 'Next Clicks That Matter'
      copy = 'These routes are driven by your chosen subjects, your logged sessions, your tracked lesson opens, and the review work that is still unfinished this week.'
    }

    return (
      '<div class="sc-engagement-panel" data-tone="' + (type === 'library' ? 'library' : 'default') + '">' +
        '<div class="sc-engagement-grid">' +
          focusMarkup(focus) +
          '<div class="sc-engagement-side">' +
            goalsMarkup(goals, 'Weekly Goals', 'Leave the targets unfinished enough that the site gives you a reason to come back tomorrow.') +
          '</div>' +
        '</div>' +
        '<div class="sc-engagement-next-shell">' +
          recommendationsMarkup(recs, heading, copy) +
        '</div>' +
      '</div>'
    )
  }

  function upsertAfter(target, key, markup, className) {
    if (!target || !target.parentNode) return null
    var existing = document.querySelector('[data-engagement-block="' + key + '"]')
    if (!existing) {
      existing = document.createElement('section')
      existing.setAttribute('data-engagement-block', key)
      existing.className = className || 'sc-engagement-shell'
      target.parentNode.insertBefore(existing, target.nextSibling)
    }
    existing.innerHTML = markup
    return existing
  }

  function upsertInside(target, key, markup, className) {
    if (!target) return null
    var existing = target.querySelector('[data-engagement-block="' + key + '"]')
    if (!existing) {
      existing = document.createElement('div')
      existing.setAttribute('data-engagement-block', key)
      existing.className = className || 'sc-engagement-inline-rail'
      target.appendChild(existing)
    }
    existing.innerHTML = markup
    return existing
  }

  function renderHome(profile) {
    var hero = document.querySelector('main > section')
    if (!hero) return
    upsertAfter(hero, 'home-focus', panelMarkup('home', detectContext(), profile), 'sc-engagement-shell max-w-7xl mx-auto px-6')
  }

  function renderDashboard(profile) {
    var authCta = document.querySelector('[data-auth-cta]')
    var hero = authCta || document.querySelector('main > section')
    if (!hero) return
    upsertAfter(hero, 'dashboard-focus', panelMarkup('dashboard', detectContext(), profile), 'sc-engagement-shell')
  }

  function renderProfile(profile) {
    var firstSection = document.querySelector('main section')
    if (!firstSection) return
    upsertAfter(firstSection, 'profile-focus', panelMarkup('profile', detectContext(), profile), 'sc-engagement-shell mb-12')
  }

  function renderLibrary(profile) {
    var context = detectContext()
    if (!context.showLibraryRail) return

    if (getCurrentPath() === 'subject-library.html') {
      var grid = document.querySelector('[data-subject-grid]')
      if (!grid) return
      upsertAfter(grid, 'subject-library-next', panelMarkup('library', context, profile), 'sc-engagement-shell')
      return
    }

    if (getCurrentPath() === 'geography-library.html') {
      var geoGrid = document.getElementById('grid')
      if (!geoGrid) return
      upsertAfter(geoGrid, 'geography-library-next', panelMarkup('library', context, profile), 'sc-engagement-shell sc-engagement-inline-rail')
      return
    }

    var root = document.getElementById('root')
    if (root && root.parentNode) {
      upsertAfter(root, slugify(getCurrentPath()) + '-next', panelMarkup('library', context, profile), 'sc-engagement-shell sc-engagement-inline-rail')
    }
  }

  function selectedChips(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (node) {
      return node.classList.contains('is-selected')
    }).map(function (node) {
      return node.getAttribute('data-value') || ''
    })
  }

  function findOption(options, value) {
    var match = null
    options.forEach(function (item) {
      if (item.value === value) match = item
    })
    return match
  }

  function defaultOnboardingProfile() {
    var context = detectContext()
    return {
      grade: context.grade || 'Grade 10',
      subjects: context.subject ? [subjectLabel(context.subject)] : [],
      goals: [],
      examDate: ''
    }
  }

  function readOnboardingState() {
    var gradeNode = document.querySelector('[data-engagement-grade-option].is-selected')
    var examNode = document.querySelector('[data-engagement-exam-date]')
    return {
      grade: gradeNode ? (gradeNode.getAttribute('data-value') || 'Grade 10') : 'Grade 10',
      subjects: selectedChips('[data-group="subjects"]'),
      goals: selectedChips('[data-group="goals"]'),
      examDate: examNode ? examNode.value : ''
    }
  }

  function syncExamPresets(value) {
    var target = parseDate(value)
    Array.prototype.slice.call(document.querySelectorAll('[data-engagement-exam-preset]')).forEach(function (node) {
      var offset = Number(node.getAttribute('data-engagement-exam-preset'))
      var isSelected = false
      if (target && !isNaN(offset)) {
        var today = new Date()
        today.setHours(0, 0, 0, 0)
        var next = new Date(today)
        next.setDate(today.getDate() + offset)
        isSelected = Math.abs(next.getTime() - target.getTime()) < 86400000
      }
      node.classList.toggle('is-selected', isSelected)
    })
  }

  function setOnboardingFeedback(message) {
    var node = document.querySelector('[data-engagement-step-feedback]')
    if (node) node.textContent = message || ''
  }

  function validateOnboardingStep(stepIndex, silent) {
    var state = readOnboardingState()
    var message = ''
    var valid = true

    if (stepIndex === 0) {
      valid = Boolean(state.grade) && state.subjects.length > 0
      message = valid
        ? state.subjects.length + ' subject' + (state.subjects.length === 1 ? '' : 's') + ' selected. Good starting scope.'
        : 'Pick a grade and at least one subject so Soul Concept knows what to prioritize.'
    } else if (stepIndex === 1) {
      valid = state.goals.length > 0
      message = valid
        ? 'Recommendation tone will lean toward ' + GOAL_OPTIONS.filter(function (goal) { return state.goals.indexOf(goal.value) !== -1 }).slice(0, 2).map(function (goal) { return goal.label.toLowerCase() }).join(' and ') + '.'
        : 'Choose at least one goal so the dashboard and recommendations feel intentional.'
    } else {
      message = state.examDate
        ? 'Exam countdown locked. Soul Concept can now pace review pressure around ' + formatDate(state.examDate) + '.'
        : 'No exam date yet is fine. You can still launch a personalized study plan now.'
    }

    if (!silent) setOnboardingFeedback(message)
    return valid
  }

  function syncOnboardingPreview() {
    var state = readOnboardingState()
    var primarySubject = subjectLabel(state.subjects[0] || 'Science')
    var gradeMeta = findOption(GRADE_OPTIONS, state.grade) || GRADE_OPTIONS[1]
    var goalLabels = GOAL_OPTIONS.filter(function (goal) {
      return state.goals.indexOf(goal.value) !== -1
    }).map(function (goal) {
      return goal.label
    })
    var examDays = daysUntil(state.examDate)
    var score = Math.max(22, Math.min(96, 24 + (state.grade ? 12 : 0) + (state.subjects.length * 11) + (state.goals.length * 10) + (state.examDate ? 14 : 0)))
    var strength = score >= 88 ? 'Highly tuned' : (score >= 68 ? 'Strongly personalized' : (score >= 50 ? 'Getting tailored' : 'Base profile locked in'))
    var lane = primarySubject + (goalLabels[0] ? ' x ' + goalLabels[0] : ' focus')
    var cadence = Math.max(3, Math.min(7, 2 + state.subjects.length + Math.ceil(state.goals.length / 2))) + ' guided pushes'
    var intensity = examDays == null
      ? (state.goals.indexOf('mastery') !== -1 ? 'Deep' : 'Steady')
      : (examDays <= 14 ? 'High' : (examDays <= 45 ? 'Focused' : 'Steady'))
    var previewTitle = (state.grade || 'Your grade') + ' ' + (state.subjects.length ? primarySubject : 'study') + ' command plan'
    var previewCopy = state.subjects.length
      ? 'Homepage cards, dashboard targets, and recommendations will center ' + primarySubject + (state.subjects.length > 1 ? ' first, while still supporting your other selected subjects.' : ' as your main focus lane.') 
      : 'Choose a subject focus and Soul Concept will start shaping the experience around it.'
    var toneCopy = goalLabels.length
      ? goalLabels.slice(0, 2).join(' + ') + ' will shape the recommendation tone and weekly pushes.'
      : 'Select at least one goal to tune the recommendation style.'
    var examCopy = examDays == null
      ? 'Flexible pacing until you add an exam date.'
      : (examDays < 0
        ? 'Exam date passed. Update it to refresh the plan.'
        : examDays === 0
          ? 'Exam is today. Recommendations shift into final review mode.'
          : examDays + ' days until exam. Countdown pacing will tighten automatically.')
    var strengthCopy = state.subjects.length && goalLabels.length
      ? 'The workspace can now prioritize ' + primarySubject + ', bias recommendation tone toward ' + goalLabels[0].toLowerCase() + ', and rebalance your dashboard around that direction.'
      : 'Add subjects, goals, and timing to make the site feel more tailored.'
    var nowCopy = 'Anchor the workspace around ' + primarySubject + ' first.'
    var nextCopy = goalLabels.length
      ? 'Push weekly targets toward ' + goalLabels.slice(0, 2).join(' + ') + '.'
      : 'Shape weekly targets from your goals.'
    var laterCopy = examDays == null
      ? 'Increase pressure automatically once an exam date exists.'
      : (examDays <= 21 ? 'Shift into sharper exam pressure and tighter reminders.' : 'Gradually increase pressure as the exam window gets closer.')

    var bindings = {
      '[data-engagement-preview-title]': previewTitle,
      '[data-engagement-preview-copy]': previewCopy,
      '[data-engagement-preview-grade]': gradeMeta.label,
      '[data-engagement-preview-subjects]': state.subjects.length ? state.subjects.length + ' selected' : 'Choose subjects',
      '[data-engagement-preview-goals]': goalLabels.length ? goalLabels.length + ' active' : 'Choose goals',
      '[data-engagement-preview-exam]': state.examDate ? formatDate(state.examDate) : 'Open date',
      '[data-engagement-preview-score]': score + '%',
      '[data-engagement-preview-strength]': strength,
      '[data-engagement-preview-strength-copy]': strengthCopy,
      '[data-engagement-preview-lane]': lane,
      '[data-engagement-preview-intensity]': intensity,
      '[data-engagement-preview-cadence]': cadence,
      '[data-engagement-preview-home]': primarySubject + ' appears first on the home experience.',
      '[data-engagement-preview-dashboard]': toneCopy,
      '[data-engagement-preview-exam-copy]': examCopy,
      '[data-engagement-preview-now]': nowCopy,
      '[data-engagement-preview-next]': nextCopy,
      '[data-engagement-preview-later]': laterCopy
    }

    Object.keys(bindings).forEach(function (selector) {
      var node = document.querySelector(selector)
      if (node) node.textContent = bindings[selector]
    })

    validateOnboardingStep(Number((document.querySelector('[data-engagement-modal]') || {}).dataset.step || 0), false)
  }

  function syncOnboardingStep(stepIndex) {
    var modal = document.querySelector('[data-engagement-modal]')
    if (!modal) return
    var nextStep = Math.max(0, Math.min(2, Number(stepIndex) || 0))
    modal.dataset.step = String(nextStep)

    Array.prototype.slice.call(document.querySelectorAll('[data-engagement-step-panel]')).forEach(function (node) {
      var index = Number(node.getAttribute('data-engagement-step-panel'))
      node.hidden = index !== nextStep
      node.classList.toggle('is-active', index === nextStep)
    })

    Array.prototype.slice.call(document.querySelectorAll('[data-engagement-step-nav]')).forEach(function (node) {
      var index = Number(node.getAttribute('data-engagement-step-nav'))
      node.classList.toggle('is-current', index === nextStep)
      node.classList.toggle('is-complete', index < nextStep)
    })

    var backButton = document.querySelector('[data-engagement-back]')
    var nextButton = document.querySelector('[data-engagement-next]')
    var submitButton = document.querySelector('[data-engagement-submit]')
    if (backButton) backButton.hidden = nextStep === 0
    if (nextButton) nextButton.hidden = nextStep === 2
    if (submitButton) submitButton.hidden = nextStep !== 2

    syncOnboardingPreview()
  }

  function hydrateOnboardingForm() {
    var profile = readEngagementProfile() || defaultOnboardingProfile()
    var exam = document.querySelector('[data-engagement-exam-date]')
    if (exam) exam.value = (profile && profile.examDate) || ''
    Array.prototype.slice.call(document.querySelectorAll('[data-engagement-grade-option]')).forEach(function (node) {
      node.classList.toggle('is-selected', (node.getAttribute('data-value') || '') === ((profile && profile.grade) || 'Grade 10'))
    })
    Array.prototype.slice.call(document.querySelectorAll('[data-engagement-chip]')).forEach(function (node) {
      var value = node.getAttribute('data-value') || ''
      var group = node.getAttribute('data-group')
      var isSelected = false
      if (profile) {
        if (group === 'subjects') isSelected = (profile.subjects || []).indexOf(value) !== -1
        if (group === 'goals') isSelected = (profile.goals || []).indexOf(value) !== -1
      }
      node.classList.toggle('is-selected', isSelected)
    })
    syncExamPresets((profile && profile.examDate) || '')
    syncOnboardingStep(0)
  }

  function ensureOnboardingModal() {
    if (document.querySelector('[data-engagement-modal]')) return
    var modal = document.createElement('div')
    modal.className = 'sc-engagement-modal'
    modal.setAttribute('data-engagement-modal', 'true')
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('data-step', '0')
    modal.innerHTML =
      '<div class="sc-engagement-dialog" role="dialog" aria-modal="true" aria-labelledby="sc-engagement-title">' +
        '<div class="sc-engagement-dialog-inner">' +
          '<div class="sc-engagement-modal-header">' +
            '<div>' +
              '<span class="sc-engagement-kicker"><span class="material-symbols-outlined">school</span>First-Time Setup</span>' +
              '<h2 class="sc-engagement-modal-title" id="sc-engagement-title">Build a study setup that feels like it was made for you.</h2>' +
              '<p class="sc-engagement-copy">Shape the experience once, then let Soul Concept tune the homepage, dashboard, profile, and study recommendations around how you actually learn.</p>' +
            '</div>' +
            '<button class="sc-engagement-close" data-engagement-close="true" type="button"><span class="material-symbols-outlined">close</span></button>' +
          '</div>' +
          '<div class="sc-engagement-setup-shell">' +
            '<form class="sc-engagement-form sc-engagement-onboarding-form" data-engagement-form="true">' +
              '<div class="sc-engagement-step-nav-row">' +
                [
                  ['0', 'Foundation', 'Grade and subjects'],
                  ['1', 'Direction', 'Goals and motivation'],
                  ['2', 'Launch', 'Exam timing and preview']
                ].map(function (step) {
                  return '<button class="sc-engagement-step-nav-button" data-engagement-step-nav="' + step[0] + '" type="button">' +
                    '<span class="sc-engagement-step-number">' + ('0' + (Number(step[0]) + 1)).slice(-2) + '</span>' +
                    '<span class="sc-engagement-step-copy"><strong>' + step[1] + '</strong><span>' + step[2] + '</span></span>' +
                  '</button>'
                }).join('') +
              '</div>' +
              '<section class="sc-engagement-step-panel" data-engagement-step-panel="0">' +
                '<div class="sc-engagement-step-heading">' +
                  '<h3 class="sc-engagement-section-title">Set the academic context.</h3>' +
                  '<p class="sc-engagement-section-copy">Start with your grade and the subjects you want Soul Concept to put at the center of the experience.</p>' +
                '</div>' +
                '<div class="sc-engagement-choice-grid sc-engagement-choice-grid--grade">' +
                  GRADE_OPTIONS.map(function (grade) {
                    return '<button class="sc-engagement-choice-card sc-engagement-choice-card--grade" data-engagement-grade-option="true" data-value="' + grade.value + '" type="button">' +
                      '<span class="sc-engagement-choice-icon"><span class="material-symbols-outlined">' + grade.icon + '</span></span>' +
                      '<span class="sc-engagement-choice-copy"><strong>' + grade.label + '</strong><span>' + grade.note + '</span></span>' +
                    '</button>'
                  }).join('') +
                '</div>' +
                '<div class="sc-engagement-field">' +
                  '<div class="sc-engagement-field-head">' +
                    '<span class="sc-engagement-label">Priority Subjects</span>' +
                    '<span class="sc-engagement-field-badge">Multi-select</span>' +
                  '</div>' +
                  '<div class="sc-engagement-choice-grid sc-engagement-choice-grid--subject">' +
                    SUBJECT_OPTIONS.map(function (subject) {
                      return '<button class="sc-engagement-choice-card sc-engagement-choice-card--subject sc-engagement-chip" data-engagement-chip="true" data-group="subjects" data-value="' + subject.value + '" type="button">' +
                        '<span class="sc-engagement-choice-icon"><span class="material-symbols-outlined">' + subject.icon + '</span></span>' +
                        '<span class="sc-engagement-choice-copy"><strong>' + subject.value + '</strong><span>' + subject.note + '</span></span>' +
                      '</button>'
                    }).join('') +
                  '</div>' +
                  '<p class="sc-engagement-helper">Choose the subjects that should appear first in your dashboard pushes, weekly suggestions, and home focus cards.</p>' +
                '</div>' +
              '</section>' +
              '<section class="sc-engagement-step-panel" data-engagement-step-panel="1" hidden>' +
                '<div class="sc-engagement-step-heading">' +
                  '<h3 class="sc-engagement-section-title">Choose how you want the platform to push you.</h3>' +
                  '<p class="sc-engagement-section-copy">These goals shape recommendation tone, weekly targets, and which kind of “next best action” shows up first.</p>' +
                '</div>' +
                '<div class="sc-engagement-choice-grid sc-engagement-choice-grid--goal">' +
                  GOAL_OPTIONS.map(function (goal) {
                    return '<button class="sc-engagement-choice-card sc-engagement-choice-card--goal sc-engagement-chip" data-engagement-chip="true" data-group="goals" data-value="' + goal.value + '" type="button">' +
                      '<span class="sc-engagement-choice-icon"><span class="material-symbols-outlined">' + goal.icon + '</span></span>' +
                      '<span class="sc-engagement-choice-copy"><strong>' + goal.label + '</strong><span>' + goal.note + '</span></span>' +
                    '</button>'
                  }).join('') +
                '</div>' +
                '<div class="sc-engagement-goal-note">Pick one or more. Soul Concept blends the tone if you choose multiple goals.</div>' +
              '</section>' +
              '<section class="sc-engagement-step-panel" data-engagement-step-panel="2" hidden>' +
                '<div class="sc-engagement-step-heading">' +
                  '<h3 class="sc-engagement-section-title">Add timing so the plan can intensify at the right moment.</h3>' +
                  '<p class="sc-engagement-section-copy">Exam timing is optional, but it lets the dashboard shift from steady momentum into sharper prep mode when it matters.</p>' +
                '</div>' +
                '<div class="sc-engagement-field">' +
                  '<label class="sc-engagement-label" for="sc-engagement-exam-date">Exam Date</label>' +
                  '<input class="sc-engagement-date" id="sc-engagement-exam-date" data-engagement-exam-date="true" type="date"/>' +
                '</div>' +
                '<div class="sc-engagement-preset-row">' +
                  [
                    ['14', '2 Weeks'],
                    ['30', '30 Days'],
                    ['60', '2 Months'],
                    ['90', '3 Months']
                  ].map(function (preset) {
                    return '<button class="sc-engagement-preset-chip" data-engagement-exam-preset="' + preset[0] + '" type="button">' + preset[1] + '</button>'
                  }).join('') +
                '</div>' +
                '<div class="sc-engagement-launch-card">' +
                  '<span class="sc-engagement-launch-kicker">What changes immediately</span>' +
                  '<div class="sc-engagement-launch-grid">' +
                    '<div><strong>Homepage</strong><span>Lead cards start reflecting your main subject focus.</span></div>' +
                    '<div><strong>Dashboard</strong><span>Targets and recommendation pacing adapt to your goals.</span></div>' +
                    '<div><strong>Profile</strong><span>Your academic identity and study direction feel intentional.</span></div>' +
                  '</div>' +
                '</div>' +
              '</section>' +
              '<p class="sc-engagement-step-feedback" data-engagement-step-feedback="true"></p>' +
              '<div class="sc-engagement-modal-actions sc-engagement-modal-actions--staged">' +
                '<button class="sc-engagement-button" data-variant="secondary" data-engagement-later="true" type="button">Set Up Later</button>' +
                '<div class="sc-engagement-modal-nav">' +
                  '<button class="sc-engagement-button" data-variant="ghost" data-engagement-back="true" type="button" hidden>Back</button>' +
                  '<button class="sc-engagement-button" data-engagement-next="true" type="button">Continue</button>' +
                  '<button class="sc-engagement-button" data-engagement-submit="true" type="submit" hidden>Launch My Study Plan</button>' +
                '</div>' +
              '</div>' +
            '</form>' +
            '<aside class="sc-engagement-setup-side">' +
              '<div class="sc-engagement-preview-card">' +
                '<span class="sc-engagement-kicker"><span class="material-symbols-outlined">auto_awesome</span>Live Personalization</span>' +
                '<h3 class="sc-engagement-preview-title" data-engagement-preview-title="true">Grade 10 study command plan</h3>' +
                '<p class="sc-engagement-preview-copy" data-engagement-preview-copy="true">Choose a subject focus and Soul Concept will start shaping the experience around it.</p>' +
                '<div class="sc-engagement-preview-metrics">' +
                  '<div class="sc-engagement-preview-metric"><span>Grade</span><strong data-engagement-preview-grade="true">Grade 10</strong></div>' +
                  '<div class="sc-engagement-preview-metric"><span>Subjects</span><strong data-engagement-preview-subjects="true">Choose subjects</strong></div>' +
                  '<div class="sc-engagement-preview-metric"><span>Goals</span><strong data-engagement-preview-goals="true">Choose goals</strong></div>' +
                  '<div class="sc-engagement-preview-metric"><span>Exam</span><strong data-engagement-preview-exam="true">Open date</strong></div>' +
                '</div>' +
                '<div class="sc-engagement-preview-orbit">' +
                  '<div class="sc-engagement-preview-orbit-ring">' +
                    '<div class="sc-engagement-preview-orbit-core">' +
                      '<span class="sc-engagement-preview-orbit-score" data-engagement-preview-score="true">48%</span>' +
                      '<span class="sc-engagement-preview-orbit-label">Profile Fit</span>' +
                    '</div>' +
                  '</div>' +
                  '<div class="sc-engagement-preview-orbit-copy">' +
                    '<span>Personalization Strength</span>' +
                    '<strong data-engagement-preview-strength="true">Base profile locked in.</strong>' +
                    '<p data-engagement-preview-strength-copy="true">Add subjects, goals, and timing to make the site feel more tailored.</p>' +
                  '</div>' +
                '</div>' +
                '<div class="sc-engagement-preview-strategy">' +
                  '<div class="sc-engagement-preview-strategy-item"><span>Recommendation Lane</span><strong data-engagement-preview-lane="true">Core subject setup</strong></div>' +
                  '<div class="sc-engagement-preview-strategy-item"><span>Study Intensity</span><strong data-engagement-preview-intensity="true">Steady</strong></div>' +
                  '<div class="sc-engagement-preview-strategy-item"><span>Weekly Cadence</span><strong data-engagement-preview-cadence="true">3 guided pushes</strong></div>' +
                '</div>' +
                '<div class="sc-engagement-preview-stack">' +
                  '<div class="sc-engagement-preview-item"><span>Home Experience</span><strong data-engagement-preview-home="true">Science appears first on the home experience.</strong></div>' +
                  '<div class="sc-engagement-preview-item"><span>Dashboard Tone</span><strong data-engagement-preview-dashboard="true">Select at least one goal to tune the recommendation style.</strong></div>' +
                  '<div class="sc-engagement-preview-item"><span>Exam Pressure</span><strong data-engagement-preview-exam-copy="true">Flexible pacing until you add an exam date.</strong></div>' +
                '</div>' +
                '<div class="sc-engagement-preview-journey">' +
                  '<div class="sc-engagement-preview-journey-item"><span>Now</span><strong data-engagement-preview-now="true">Anchor the workspace around your first selected subject.</strong></div>' +
                  '<div class="sc-engagement-preview-journey-item"><span>Next</span><strong data-engagement-preview-next="true">Shape weekly targets from your goals.</strong></div>' +
                  '<div class="sc-engagement-preview-journey-item"><span>Later</span><strong data-engagement-preview-later="true">Increase pressure as the exam window gets closer.</strong></div>' +
                '</div>' +
              '</div>' +
              '<div class="sc-engagement-preview-note">' +
                '<span class="material-symbols-outlined">psychology_alt</span>' +
                '<p>The setup is not cosmetic. It changes which subject surfaces first, how aggressive reminders feel, and what the site thinks your next move should be.</p>' +
              '</div>' +
            '</aside>' +
          '</div>' +
        '</div>' +
      '</div>'
    document.body.appendChild(modal)
  }

  function openOnboarding() {
    ensureOnboardingModal()
    var modal = document.querySelector('[data-engagement-modal]')
    if (!modal) return
    hydrateOnboardingForm()
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  function closeOnboarding() {
    var modal = document.querySelector('[data-engagement-modal]')
    if (!modal) return
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  function maybeOpenOnboarding() {
    var profile = readEngagementProfile()
    var dismissed = readJson(DISMISS_KEY, null)
    if (profile || dismissed) return
    window.setTimeout(openOnboarding, 500)
  }

  function renderLessonRecommendations(index) {
    if (!PANELS_ENABLED) return
    if (getCurrentPath() !== 'geography-library.html') return
    var titleNode = document.getElementById('modal-title')
    var body = document.getElementById('modal-body')
    if (!body || !titleNode) return
    var profile = readEngagementProfile() || {}
    trackLessonOpen('Geography', 'geography-lesson-' + index, titleNode.textContent || ('Lesson ' + (index + 1)))
    var nextIndex = index + 1 < 10 ? index + 1 : null
    upsertInside(body, 'geography-modal-next', panelMarkup('library', detectContext(), profile, {
      lessonTitle: titleNode.textContent || 'Lesson',
      nextLessonIndex: nextIndex
    }), 'sc-engagement-inline-rail')
  }

  function patchGeographyModal() {
    if (getCurrentPath() !== 'geography-library.html') return
    if (window.__scEngagementGeoPatched) return
    if (typeof window.openModal !== 'function') return
    var original = window.openModal
    var wrapped = function (index) {
      original(index)
      renderLessonRecommendations(index)
    }
    window.openModal = wrapped
    try { openModal = wrapped } catch (_err) {}
    window.__scEngagementGeoPatched = true
  }

  function renderAll() {
    Array.prototype.slice.call(document.querySelectorAll('[data-engagement-block]')).forEach(function (node) {
      node.remove()
    })
    if (!PANELS_ENABLED) return
    var profile = readEngagementProfile() || {}
    var context = detectContext()
    if (context.page === 'home') renderHome(profile)
    if (context.page === 'dashboard') renderDashboard(profile)
    if (context.page === 'profile') renderProfile(profile)
    if (context.showLibraryRail) renderLibrary(profile)
    patchGeographyModal()
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-engagement-chip]')
      if (chip) {
        chip.classList.toggle('is-selected')
        syncOnboardingPreview()
        return
      }

      var gradeOption = event.target.closest('[data-engagement-grade-option]')
      if (gradeOption) {
        Array.prototype.slice.call(document.querySelectorAll('[data-engagement-grade-option]')).forEach(function (node) {
          node.classList.toggle('is-selected', node === gradeOption)
        })
        syncOnboardingPreview()
        return
      }

      var stepButton = event.target.closest('[data-engagement-step-nav]')
      if (stepButton) {
        var targetStep = Number(stepButton.getAttribute('data-engagement-step-nav'))
        var modal = document.querySelector('[data-engagement-modal]')
        var currentStep = Number((modal && modal.dataset.step) || 0)
        if (targetStep <= currentStep || validateOnboardingStep(currentStep, false)) {
          syncOnboardingStep(targetStep)
        }
        return
      }

      var presetButton = event.target.closest('[data-engagement-exam-preset]')
      if (presetButton) {
        var offset = Number(presetButton.getAttribute('data-engagement-exam-preset'))
        var examNode = document.querySelector('[data-engagement-exam-date]')
        if (examNode && !isNaN(offset)) {
          var date = new Date()
          date.setHours(0, 0, 0, 0)
          date.setDate(date.getDate() + offset)
          examNode.value = date.toISOString().slice(0, 10)
          syncExamPresets(examNode.value)
          syncOnboardingPreview()
        }
        return
      }

      var openBtn = event.target.closest('[data-engagement-open-onboarding]')
      if (openBtn) {
        openOnboarding()
        return
      }

      var closeBtn = event.target.closest('[data-engagement-close]')
      if (closeBtn) {
        closeOnboarding()
        return
      }

      var laterBtn = event.target.closest('[data-engagement-later]')
      if (laterBtn) {
        writeJson(DISMISS_KEY, { dismissedAt: new Date().toISOString() })
        closeOnboarding()
        return
      }

      var backBtn = event.target.closest('[data-engagement-back]')
      if (backBtn) {
        var currentBackStep = Number(((document.querySelector('[data-engagement-modal]') || {}).dataset.step) || 0)
        syncOnboardingStep(currentBackStep - 1)
        return
      }

      var nextBtn = event.target.closest('[data-engagement-next]')
      if (nextBtn) {
        var currentNextStep = Number(((document.querySelector('[data-engagement-modal]') || {}).dataset.step) || 0)
        if (validateOnboardingStep(currentNextStep, false)) {
          syncOnboardingStep(currentNextStep + 1)
        }
        return
      }

      var lessonBtn = event.target.closest('[data-engagement-open-lesson]')
      if (lessonBtn) {
        var lessonIndex = Number(lessonBtn.getAttribute('data-engagement-open-lesson'))
        if (!isNaN(lessonIndex) && typeof window.openModal === 'function') {
          window.openModal(lessonIndex)
        }
      }
    })

    document.addEventListener('submit', function (event) {
      var form = event.target.closest('[data-engagement-form]')
      if (!form) return
      event.preventDefault()
      if (!validateOnboardingStep(0, false)) return syncOnboardingStep(0)
      if (!validateOnboardingStep(1, false)) return syncOnboardingStep(1)
      var profile = readOnboardingState()
      if (!profile.subjects.length) profile.subjects = ['Science']
      saveEngagementProfile(profile)
      closeOnboarding()
      renderAll()
    })

    document.addEventListener('change', function (event) {
      if (event.target.matches('[data-engagement-exam-date]')) {
        syncExamPresets(event.target.value)
        syncOnboardingPreview()
      }
    })

    window.addEventListener('storage', renderAll)
    window.addEventListener('sc:auth-state-changed', renderAll)
    window.addEventListener('sc:engagement-updated', renderAll)
  }

  function init() {
    if (initialized) return
    initialized = true
    ensureOnboardingModal()
    bindEvents()
    renderAll()
    maybeOpenOnboarding()
  }

  window.SoulEngagement = {
    openOnboarding: openOnboarding,
    renderAll: renderAll,
    renderLessonRecommendations: renderLessonRecommendations,
    trackLessonOpen: trackLessonOpen,
    readProfile: readEngagementProfile
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})();
