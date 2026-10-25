export interface QuizData {
  title?: string
  questions: {
    question: string
    options: string[]
    correctIndex: number
  }[]
}

const STYLE = String.raw`
:root{color-scheme:light dark;--bg:#f6f7f9;--card:#fff;--text:#111827;--muted:#6b7280;--border:#e5e7eb;--accent:#4f46e5;--ok:#16a34a;--ok-bg:#dcfce7;--bad:#dc2626;--bad-bg:#fee2e2;--soft:#eef0f4}
@media (prefers-color-scheme:dark){:root{--bg:#0b0f14;--card:#151a21;--text:#f3f4f6;--muted:#9ca3af;--border:#2a313b;--accent:#818cf8;--ok:#4ade80;--ok-bg:#12301f;--bad:#f87171;--bad-bg:#3b1618;--soft:#1f2630}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;justify-content:center;padding:24px 16px;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.card{width:100%;max-width:680px;align-self:flex-start;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;display:flex;flex-direction:column;gap:18px}
h1{font-size:1.15rem;margin:0}
.head p{margin:2px 0 0}
.muted{color:var(--muted);font-size:.9rem}
.center{text-align:center;margin:0}
.bar{height:6px;border-radius:99px;background:var(--soft);overflow:hidden}
.fill{height:100%;background:var(--accent);transition:width .2s}
.dots{display:flex;flex-wrap:wrap;gap:6px}
.dot{width:26px;height:26px;border-radius:50%;border:0;background:var(--soft);color:var(--muted);font-size:.75rem;cursor:pointer}
.dot.ok{background:var(--ok);color:#fff}
.dot.bad{background:var(--bad);color:#fff}
.dot.now{outline:2px solid var(--accent);outline-offset:2px}
.question{font-size:1.05rem;font-weight:600;margin:0}
.options{display:flex;flex-direction:column;gap:8px}
.option{display:flex;gap:12px;align-items:flex-start;text-align:start;width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:transparent;color:inherit;font:inherit;cursor:pointer}
.option:hover{background:var(--soft)}
.option .letter{flex:none;width:24px;height:24px;border-radius:50%;background:var(--soft);display:grid;place-items:center;font-size:.75rem;font-weight:600}
.option.ok{border-color:var(--ok);background:var(--ok-bg)}
.option.bad{border-color:var(--bad);background:var(--bad-bg)}
.option.dim{opacity:.6}
.feedback{padding:10px 14px;border-radius:10px;font-size:.95rem}
.feedback.ok{background:var(--ok-bg);color:var(--ok)}
.feedback.bad{background:var(--bad-bg);color:var(--bad)}
.nav{display:flex;justify-content:space-between;gap:8px}
.btn{padding:9px 16px;border-radius:10px;border:1px solid var(--border);background:transparent;color:inherit;font:inherit;cursor:pointer}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
.score{font-size:3rem;font-weight:700;text-align:center;margin:0}
.review{list-style:none;margin:0;padding:0;border:1px solid var(--border);border-radius:10px;overflow:hidden}
.review li+li{border-top:1px solid var(--border)}
.review-item{display:flex;gap:10px;width:100%;padding:10px 12px;border:0;background:transparent;color:inherit;font:inherit;text-align:start;cursor:pointer}
.review-item:hover{background:var(--soft)}
.review-item .mark{flex:none;font-weight:700}
.review-item.ok .mark{color:var(--ok)}
.review-item.bad .mark{color:var(--bad)}
.review-item small{display:block;color:var(--muted)}
`

// Runs inside the downloaded file. It builds the DOM with textContent only,
// so quiz text is never parsed as HTML. No template literals in here.
const SCRIPT = String.raw`
(function () {
  var data = JSON.parse(document.getElementById('quiz-data').textContent);
  var qs = data.questions;
  var answers = qs.map(function () { return null; });
  var cur = 0;
  var finished = false;
  var app = document.getElementById('app');
  var LETTERS = 'ABCDEF';

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function auto(node) { node.setAttribute('dir', 'auto'); return node; }
  function btn(cls, text, onClick) {
    var b = el('button', cls, text);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }
  function score() {
    return answers.filter(function (a, i) { return a !== null && a === qs[i].correctIndex; }).length;
  }
  function header(sub) {
    var h = el('div', 'head');
    h.appendChild(auto(el('h1', '', data.title)));
    h.appendChild(el('p', 'muted', sub));
    return h;
  }

  function renderQuestion() {
    var q = qs[cur];
    var picked = answers[cur];
    var answered = picked !== null;

    app.appendChild(header('Question ' + (cur + 1) + ' of ' + qs.length));

    var bar = el('div', 'bar');
    var fill = el('div', 'fill');
    fill.style.width = ((cur + 1) / qs.length * 100) + '%';
    bar.appendChild(fill);
    app.appendChild(bar);

    var dots = el('div', 'dots');
    qs.forEach(function (item, i) {
      var cls = 'dot';
      if (answers[i] !== null) cls += answers[i] === item.correctIndex ? ' ok' : ' bad';
      if (i === cur) cls += ' now';
      var d = btn(cls, String(i + 1), function () { cur = i; render(); });
      d.setAttribute('aria-label', 'Go to question ' + (i + 1));
      dots.appendChild(d);
    });
    app.appendChild(dots);

    app.appendChild(auto(el('p', 'question', q.question)));

    var list = el('div', 'options');
    q.options.forEach(function (option, i) {
      var cls = 'option';
      if (answered) {
        if (i === q.correctIndex) cls += ' ok';
        else if (i === picked) cls += ' bad';
        else cls += ' dim';
      }
      var b = el('button', cls);
      b.type = 'button';
      b.appendChild(el('span', 'letter', LETTERS[i]));
      b.appendChild(auto(el('span', 'text', option)));
      b.addEventListener('click', function () {
        if (answers[cur] !== null) return;
        answers[cur] = i;
        render();
      });
      list.appendChild(b);
    });
    app.appendChild(list);

    if (answered) {
      var ok = picked === q.correctIndex;
      var fb = el('div', 'feedback ' + (ok ? 'ok' : 'bad'));
      fb.setAttribute('role', 'status');
      fb.appendChild(el('strong', '', ok ? 'Correct!' : 'Not quite'));
      if (!ok) {
        fb.appendChild(auto(el('span', '', ' Correct answer: ' + LETTERS[q.correctIndex] + '. ' + q.options[q.correctIndex])));
      }
      app.appendChild(fb);
    }

    var nav = el('div', 'nav');
    var prev = btn('btn', 'Previous', function () { cur--; render(); });
    prev.disabled = cur === 0;
    nav.appendChild(prev);
    if (cur < qs.length - 1) {
      nav.appendChild(btn('btn primary', 'Next', function () { cur++; render(); }));
    } else {
      nav.appendChild(btn('btn primary', 'Finish', function () { finished = true; render(); }));
    }
    app.appendChild(nav);
  }

  function renderResults() {
    var total = qs.length;
    var s = score();
    var pct = total ? Math.round(s / total * 100) : 0;
    var unanswered = answers.filter(function (a) { return a === null; }).length;

    app.appendChild(header('Results'));

    var big = el('p', 'score');
    big.appendChild(document.createTextNode(String(s)));
    big.appendChild(el('span', 'muted', ' / ' + total));
    app.appendChild(big);
    app.appendChild(el('p', 'muted center', pct + '%'));
    if (unanswered) {
      app.appendChild(el('p', 'muted center', unanswered + ' unanswered, counted as incorrect.'));
    }

    var list = el('ul', 'review');
    qs.forEach(function (q, i) {
      var a = answers[i];
      var status = a === null ? 'skip' : a === q.correctIndex ? 'ok' : 'bad';
      var mark = status === 'ok' ? '✓' : status === 'bad' ? '✗' : '–';
      var line = a === null
        ? 'Not answered. Correct: ' + q.options[q.correctIndex]
        : a === q.correctIndex
          ? 'Your answer: ' + q.options[a]
          : 'Your answer: ' + q.options[a] + ' | Correct: ' + q.options[q.correctIndex];

      var li = el('li');
      var b = el('button', 'review-item ' + status);
      b.type = 'button';
      b.appendChild(el('span', 'mark', mark));
      var body = el('span');
      body.appendChild(auto(el('span', '', (i + 1) + '. ' + q.question)));
      body.appendChild(auto(el('small', '', line)));
      b.appendChild(body);
      b.addEventListener('click', function () { cur = i; finished = false; render(); });
      li.appendChild(b);
      list.appendChild(li);
    });
    app.appendChild(list);

    var nav = el('div', 'nav');
    nav.appendChild(el('span'));
    nav.appendChild(btn('btn', 'Retake quiz', function () {
      answers = qs.map(function () { return null; });
      cur = 0;
      finished = false;
      render();
    }));
    app.appendChild(nav);
  }

  function render() {
    app.textContent = '';
    if (finished) renderResults(); else renderQuestion();
  }

  render();
})();
`

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'quiz'
}

/** Builds a single self-contained HTML file (no external requests) for the quiz. */
export function buildQuizHtml(quiz: QuizData): string {
  const title = quiz.title?.trim() || 'Quiz'

  // `<` is escaped so quiz text can never close the script tag
  const json = JSON.stringify({ title, questions: quiz.questions }).replace(/</g, '\\u003c')

  return [
    '<!doctype html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
    `<style>${STYLE}</style>`,
    '</head>',
    '<body>',
    '<main class="card" id="app"></main>',
    '<noscript>This quiz needs JavaScript to run.</noscript>',
    `<script id="quiz-data" type="application/json">${json}</script>`,
    `<script>${SCRIPT}</script>`,
    '</body>',
    '</html>'
  ].join('\n')
}

/** Browser only: downloads the quiz as a standalone .html file. */
export function downloadQuizHtml(quiz: QuizData) {
  const blob = new Blob([buildQuizHtml(quiz)], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${slugify(quiz.title?.trim() || 'quiz')}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
