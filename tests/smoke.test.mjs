import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const scripts = ['questions.js','lectures.js','foundation-roots.js','foundation-bridges-a.js','foundation-bridges-b.js','curriculum-init.js','antibiotic-depth-a.js','antibiotic-depth-b.js','drug-antiviral.js','drug-antifungal.js','drug-antiparasitic.js','antibiotic-course.js','non-drug-depth-a.js','non-drug-depth-b.js','non-drug-course.js','non-drug-gaps.js','question-concept-links.js','first-principles-concepts.js','in-lesson-concepts.js','lectures-ui.js','app.js'];
const windowData = {};
vm.runInNewContext(read('questions.js'), { window: windowData }, { filename: 'questions.js' });
vm.runInNewContext(read('lectures.js'), { window: windowData }, { filename: 'lectures.js' });
const questions = windowData.QUESTION_BANK, lectures = windowData.INFECT_LECTURES;

test('all JavaScript sources parse', () => {
  for (const src of scripts) assert.doesNotThrow(() => new vm.Script(read(src), { filename: src }), src);
});

test('problem bank is complete and explanation-rich', () => {
  assert.equal(questions.length, 102);
  const ids = new Set();
  for (const q of questions) {
    assert.ok(!ids.has(q.id), 'duplicate question ID: ' + q.id);
    ids.add(q.id);
    assert.ok(typeof q.question === 'string' && q.question.length >= 4);
    assert.ok(Array.isArray(q.options) && q.options.length === 4);
    assert.ok(Array.isArray(q.reasons) && q.reasons.length === 4);
    assert.ok(q.reasons.every(s => typeof s === 'string' && s.length > 5));
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.ok(q.explanation && q.point && q.category);
  }
});

test('deep-dive lecture chapters have eight sections and valid CBT links', () => {
  assert.equal(lectures.length, 39);
  const allIds = new Set(questions.map(q => q.id));
  const lessonIds = new Set();
  for (const l of lectures) {
    assert.ok(!lessonIds.has(l.id), 'duplicate lecture ID ' + l.id);
    lessonIds.add(l.id);
    assert.ok(l.title && l.subtitle && l.category);
    assert.ok(l.sections.length >= 8, l.title + ' must have eight sections');
    for (const s of l.sections) {
      assert.ok(s.title && s.body.length >= 45, 'too short: ' + l.title + '/' + s.title);
    }
    assert.ok(l.questionIds.length >= 2, l.id + ': no learning check questions');
    for (const id of l.questionIds) assert.ok(allIds.has(id), l.id + ' invalid question link ' + id);
  }
  const categories = new Set(lectures.map(l => l.category));
  assert.equal(categories.size, 8);
});

function boot(initialSaved = null) {
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) {
      const tokens = new Set();
      elements.set(id, {
        innerHTML: '', textContent: '',
        classList: {
          add: x => tokens.add(x),
          remove: x => tokens.delete(x),
          toggle: (x, on) => { if (on) tokens.add(x); else tokens.delete(x); },
          contains: x => tokens.has(x)
        }
      });
    }
    return elements.get(id);
  };
  const events = {};
  const storage = new Map(initialSaved ? [['infectlab-v1', JSON.stringify(initialSaved)]] : []);
  const localStorage = {
    getItem: k => storage.get(k) ?? null,
    setItem: (k, v) => storage.set(k, String(v))
  };
  const document = {
    getElementById: get,
    querySelectorAll: () => [],
    addEventListener: (event, callback) => { events[event] = callback; }
  };
  const window = { scrollTo: () => {} };
  const ctx = vm.createContext({
    window, document, localStorage,
    setTimeout: () => 1, clearTimeout: () => {},
    confirm: () => true,
    console
  });
  for(const src of scripts)vm.runInContext(read(src), ctx, {filename:src});
  const click = data => events.click({
    target: { closest: () => ({ dataset: data }) },
    preventDefault: () => {}
  });
  return { click, app: get('app'), localStorage, events };
}

test('page boot + lecture navigation + reading record + targeted quiz works', () => {
  const saved = { records: { F001: { seen: 1, correct: 1, wrong: 0, lastCorrect: true } }, bookmarks: { F001: true } };
  const s = boot(saved);
  assert.match(s.app.innerHTML, /感染症の薬を/);
  s.click({ route: 'lectures' });
  assert.match(s.app.innerHTML, /すべての薬/);
  assert.match(s.app.innerHTML, /アミノグリコシド系/);
  s.click({ action: 'lecture-open', id: 'L07' });
  assert.match(s.app.innerHTML, /嫌気性菌/);
  assert.match(s.app.innerHTML, /STEP 0 \\/ FIRST PRINCIPLES/);
  assert.match(s.app.innerHTML, /30S・50S・翻訳をゼロから/);
  assert.match(s.app.innerHTML, /講義の確認テスト/);
  s.click({ action: 'lecture-mark', id: 'L07' });
  const latest = JSON.parse(s.localStorage.getItem('infectlab-v1'));
  assert.equal(latest.lectures.L07, true);
  assert.equal(latest.records.F001.seen, 1, 'must preserve old records');
  assert.equal(latest.bookmarks.F001, true);
  s.click({ action: 'lecture-quiz', id: 'L07' });
  assert.match(s.app.innerHTML, /理解度チェック/);
  assert.match(s.app.innerHTML, /選択肢|アミノグリコシド|抗菌薬/);
  s.click({ action: 'answer', index: '0' });
  assert.match(s.app.innerHTML, /CHECK POINT/);
  s.click({ action: 'next' });
  assert.match(s.app.innerHTML, /quiz-card/);
  s.click({ route: 'home' });
  s.click({ route: 'notes' });
  assert.match(s.app.innerHTML, /まとめノート/);
  s.click({ route: 'library' });
  assert.match(s.app.innerHTML, /問題ライブラリ/);
  s.click({ route: 'progress' });
  assert.match(s.app.innerHTML, /学習データ/);
});

test('HTML and CSS connect all course assets and mobile navigation', () => {
  const html = read('index.html'), css = read('styles.css');
  for (const file of scripts) assert.ok(html.includes('src="' + file + '"'), 'script not linked ' + file);
  assert.match(html, /data-route="lectures"/);
  assert.match(css, /course-layout/);
  assert.match(css, /mobile-nav/);
});
