(function () {
  function buildCard() {
    var card = document.createElement('div');
    card.className = 'bg-white rounded-xl overflow-hidden border-2 border-gray-100';

    var head = document.createElement('div');
    head.className = 'relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-5 overflow-hidden h-24';

    var title = document.createElement('h2');
    title.className = 'font-bold text-white text-xl';
    title.textContent = 'Auto Generating Quiz';

    var subtitle = document.createElement('p');
    subtitle.className = 'text-white/90 text-xs';
    subtitle.textContent = 'Practice & Test Preparation';

    head.appendChild(title);
    head.appendChild(subtitle);

    var body = document.createElement('div');
    body.className = 'p-4';
    body.innerHTML = '' +
      '<div class="rounded-lg border border-amber-200 bg-amber-50/70 p-3 mb-3">' +
        '<p class="text-sm text-gray-700 mb-2">Auto-generating questions across Algebra, Geometry, Trig, and Probability.</p>' +
        '<div class="flex flex-wrap gap-2 text-xs font-semibold text-amber-700">' +
          '<span>Timed</span><span>•</span><span>Scored</span><span>•</span><span>Level up</span>' +
        '</div>' +
      '</div>' +
      '<div class="grid gap-3">' +
        '<div class="grid grid-cols-3 gap-2">' +
          '<div class="rounded-lg bg-gray-50 p-2 text-center"><div class="text-xs text-gray-500">Time</div><div id="aq-time" class="text-lg font-bold">90</div></div>' +
          '<div class="rounded-lg bg-gray-50 p-2 text-center"><div class="text-xs text-gray-500">Score</div><div id="aq-score" class="text-lg font-bold">0</div></div>' +
          '<div class="rounded-lg bg-gray-50 p-2 text-center"><div class="text-xs text-gray-500">Level</div><div id="aq-level" class="text-lg font-bold">1</div></div>' +
        '</div>' +
        '<div id="aq-question" class="rounded-lg bg-white border border-gray-200 p-3 text-sm">Ready to start?</div>' +
        '<div id="aq-note" class="text-xs text-gray-500">Choose a subject then press Start.</div>' +
        '<div class="grid gap-2">' +
          '<label class="text-xs font-semibold text-gray-600" for="aq-subject">Subject Focus</label>' +
          '<select id="aq-subject" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">' +
            '<option value="mixed">Mixed (All Subjects)</option>' +
            '<option value="algebra">Algebra</option>' +
            '<option value="geometry">Geometry</option>' +
            '<option value="trigonometry">Trigonometry</option>' +
            '<option value="probability">Probability</option>' +
          '</select>' +
        '</div>' +
        '<div class="flex flex-wrap gap-2">' +
          '<input id="aq-answer" type="number" inputmode="decimal" placeholder="Answer" class="flex-1 min-w-[120px] rounded-lg border border-gray-200 px-3 py-2 text-sm" />' +
          '<button id="aq-start" class="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold">Start</button>' +
          '<button id="aq-submit" class="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold">Submit</button>' +
          '<button id="aq-skip" class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold">Skip</button>' +
        '</div>' +
        '<div id="aq-feedback" class="text-xs text-gray-500"></div>' +
      '</div>';

    card.appendChild(head);
    card.appendChild(body);
    return card;
  }

  function initQuiz(scope) {
    var subjectSelect = scope.querySelector('#aq-subject');
    var timeEl = scope.querySelector('#aq-time');
    var scoreEl = scope.querySelector('#aq-score');
    var levelEl = scope.querySelector('#aq-level');
    var questionEl = scope.querySelector('#aq-question');
    var noteEl = scope.querySelector('#aq-note');
    var answerEl = scope.querySelector('#aq-answer');
    var feedbackEl = scope.querySelector('#aq-feedback');
    var startBtn = scope.querySelector('#aq-start');
    var submitBtn = scope.querySelector('#aq-submit');
    var skipBtn = scope.querySelector('#aq-skip');

    var timeLeft = 90;
    var score = 0;
    var level = 1;
    var correctInLevel = 0;
    var currentAnswer = 0;
    var currentTolerance = 0.1;
    var currentAnswerDisplay = '';
    var timerId = null;

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pick(arr) {
      return arr[randInt(0, arr.length - 1)];
    }

    function roundTo(value, decimals) {
      var factor = Math.pow(10, decimals);
      return Math.round(value * factor) / factor;
    }

    function degToRad(deg) {
      return (deg * Math.PI) / 180;
    }

    function makeAlgebraQuestion() {
      var variants = [
        function () {
          var a = randInt(2, 8);
          var x = randInt(2, 12);
          var b = randInt(1, 12);
          var c = a * x + b;
          return { text: 'Solve for x: ' + a + 'x + ' + b + ' = ' + c, answer: x, tolerance: 0, answerDisplay: '' + x, note: 'Answer as a whole number.' };
        },
        function () {
          var a = randInt(2, 6);
          var x = randInt(2, 10);
          var b = randInt(2, 8);
          var c = a * (x - b);
          return { text: 'Solve for x: ' + a + '(x - ' + b + ') = ' + c, answer: x, tolerance: 0, answerDisplay: '' + x, note: 'Answer as a whole number.' };
        },
        function () {
          var base = randInt(5, 12);
          var rate = randInt(2, 6);
          var visits = randInt(4, 12);
          var total = base + rate * visits;
          return { text: 'A gym charges $' + base + ' plus $' + rate + ' per visit. Your bill is $' + total + '. How many visits did you make?', answer: visits, tolerance: 0, answerDisplay: '' + visits, note: 'Answer as a whole number.' };
        }
      ];
      return pick(variants)();
    }

    function makeGeometryQuestion() {
      var variants = [
        function () {
          var length = randInt(6, 20);
          var width = randInt(4, 16);
          var area = length * width;
          return { text: 'A rectangle is ' + length + ' cm by ' + width + ' cm. What is its area?', answer: area, tolerance: 0, answerDisplay: '' + area, note: 'Answer in square centimeters.' };
        },
        function () {
          var base = randInt(6, 18);
          var height = randInt(4, 14);
          var area = roundTo(0.5 * base * height, 1);
          return { text: 'A triangle has base ' + base + ' m and height ' + height + ' m. What is its area? Round to the nearest tenth.', answer: area, tolerance: 0.1, answerDisplay: '' + area, note: 'Round to the nearest tenth.' };
        },
        function () {
          var a = randInt(3, 9);
          var b = randInt(4, 12);
          var c = Math.sqrt(a * a + b * b);
          var hyp = roundTo(c, 1);
          return { text: 'A right triangle has legs ' + a + ' cm and ' + b + ' cm. Find the hypotenuse. Round to the nearest tenth.', answer: hyp, tolerance: 0.1, answerDisplay: '' + hyp, note: 'Round to the nearest tenth.' };
        },
        function () {
          var r = randInt(3, 12);
          var circumference = roundTo(2 * 3.14 * r, 1);
          return { text: 'A circle has radius ' + r + ' m. Using π = 3.14, find the circumference. Round to the nearest tenth.', answer: circumference, tolerance: 0.1, answerDisplay: '' + circumference, note: 'Use π = 3.14 and round to the nearest tenth.' };
        }
      ];
      return pick(variants)();
    }

    function makeTrigQuestion() {
      var angle = randInt(25, 65);
      var dist = randInt(10, 40);
      var height = randInt(6, 25);
      var variants = [
        function () {
          var h = roundTo(dist * Math.tan(degToRad(angle)), 1);
          return { text: 'A lookout tower is ' + dist + ' m away. The angle of elevation to the top is ' + angle + '°. How tall is the tower?', answer: h, tolerance: 0.1, answerDisplay: '' + h, note: 'Round to the nearest tenth.' };
        },
        function () {
          var run = roundTo(height / Math.tan(degToRad(angle)), 1);
          return { text: 'A hill rises ' + height + ' m with an angle of elevation of ' + angle + '°. What is the horizontal run?', answer: run, tolerance: 0.1, answerDisplay: '' + run, note: 'Round to the nearest tenth.' };
        },
        function () {
          var hyp = roundTo(height / Math.sin(degToRad(angle)), 1);
          return { text: 'A drone is ' + height + ' m above the ground. The angle of elevation is ' + angle + '°. How far away is the drone?', answer: hyp, tolerance: 0.1, answerDisplay: '' + hyp, note: 'Round to the nearest tenth.' };
        }
      ];
      return pick(variants)();
    }

    function makeProbabilityQuestion() {
      var variants = [
        function () {
          var red = randInt(2, 8);
          var blue = randInt(2, 8);
          var green = randInt(2, 8);
          var total = red + blue + green;
          var prob = roundTo(red / total, 2);
          return { text: 'A bag has ' + red + ' red, ' + blue + ' blue, and ' + green + ' green marbles. What is the probability of drawing red?', answer: prob, tolerance: 0.01, answerDisplay: '' + prob, note: 'Answer as a decimal rounded to the nearest hundredth.' };
        },
        function () {
          var prob = roundTo(1 / 12, 2);
          return { text: 'You flip a coin and roll a standard die. What is the probability of heads and a 6?', answer: prob, tolerance: 0.01, answerDisplay: '' + prob, note: 'Answer as a decimal rounded to the nearest hundredth.' };
        },
        function () {
          var total = 10;
          var even = 5;
          var prob = roundTo(even / total, 2);
          return { text: 'A card numbered 1-10 is chosen. What is the probability of an even number?', answer: prob, tolerance: 0.01, answerDisplay: '' + prob, note: 'Answer as a decimal rounded to the nearest hundredth.' };
        }
      ];
      return pick(variants)();
    }

    var SUBJECTS = {
      mixed: { label: 'Mixed', make: function () { return pick([makeAlgebraQuestion, makeGeometryQuestion, makeTrigQuestion, makeProbabilityQuestion])(); } },
      algebra: { label: 'Algebra', make: makeAlgebraQuestion },
      geometry: { label: 'Geometry', make: makeGeometryQuestion },
      trigonometry: { label: 'Trigonometry', make: makeTrigQuestion },
      probability: { label: 'Probability', make: makeProbabilityQuestion }
    };

    function updateStats() {
      timeEl.textContent = timeLeft;
      scoreEl.textContent = score;
      levelEl.textContent = level;
    }

    function makeQuestion() {
      var subject = SUBJECTS[subjectSelect.value || 'mixed'];
      var q = subject.make();
      currentAnswer = q.answer;
      currentTolerance = q.tolerance;
      currentAnswerDisplay = q.answerDisplay;
      questionEl.textContent = q.text;
      noteEl.textContent = q.note || '';
      answerEl.value = '';
      answerEl.focus();
    }

    function tick() {
      timeLeft -= 1;
      updateStats();
      if (timeLeft <= 0) endGame();
    }

    function startGame() {
      timeLeft = 90;
      score = 0;
      level = 1;
      correctInLevel = 0;
      feedbackEl.textContent = '';
      updateStats();
      makeQuestion();
      if (timerId) clearInterval(timerId);
      timerId = setInterval(tick, 1000);
    }

    function submitAnswer() {
      var value = answerEl.value.trim();
      if (value === '') return;
      var num = Number(value);
      if (Number.isNaN(num)) return;

      if (Math.abs(num - currentAnswer) <= currentTolerance) {
        score += 10;
        correctInLevel += 1;
        feedbackEl.textContent = 'Correct! +10 points';
      } else {
        score = Math.max(0, score - 5);
        feedbackEl.textContent = 'Not quite. The answer was ' + currentAnswerDisplay + '. -5 points';
      }

      if (correctInLevel >= 5) {
        level += 1;
        correctInLevel = 0;
        timeLeft += 6;
        feedbackEl.textContent += ' | Level up! +6 seconds';
      }

      updateStats();
      makeQuestion();
    }

    function skipQuestion() {
      score = Math.max(0, score - 2);
      feedbackEl.textContent = 'Skipped. -2 points';
      updateStats();
      makeQuestion();
    }

    function endGame() {
      if (timerId) clearInterval(timerId);
      timerId = null;
      feedbackEl.textContent = 'Time\'s up! Final score: ' + score;
    }

    startBtn.addEventListener('click', startGame);
    submitBtn.addEventListener('click', submitAnswer);
    answerEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitAnswer(); });
    skipBtn.addEventListener('click', skipQuestion);
  }

  function findPracticeGrid() {
    var grids = document.querySelectorAll('div.grid.gap-6');
    if (grids.length) return grids[0];
    return null;
  }

  function insertCard() {
    if (document.getElementById('auto-generating-quiz-card')) return;
    var grid = findPracticeGrid();
    if (!grid) return;
    var card = buildCard();
    card.id = 'auto-generating-quiz-card';
    grid.insertBefore(card, grid.firstChild);
    initQuiz(card);
  }

  function init() {
    insertCard();
    var root = document.getElementById('root');
    if (!root) return;
    var obs = new MutationObserver(function () { insertCard(); });
    obs.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
