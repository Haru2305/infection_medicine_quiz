import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = filename => readFileSync(path.join(root, filename), 'utf8');

function launch() {
  let html = '';
  let breadcrumb = '';
  const storage = new Map();
  const app = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const document = {
    listeners: new Map(),
    getElementById(id) {
      if (id === 'app') return app;
      if (id === 'breadcrumb') return { set textContent(value) { breadcrumb = value; } };
      if (id === 'toast') return { textContent: '', classList: { add() {}, remove() {} } };
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener(type, fn) { this.listeners.set(type, fn); }
  };
  const window = { scrollTo() {} };
  const localStorage = { getItem: key => storage.get(key) || null, setItem: (key,value) => storage.set(key,value) };
  const context = vm.createContext({ window, document, localStorage, setTimeout: () => 0, clearTimeout() {}, confirm: () => true, console });
  for (const name of ['questions.js', 'lectures.js', 'lectures-ui.js', 'app.js']) {
    vm.runInContext(read(name), context, { filename: name });
  }
  return {
    window, storage,
    get html() { return html; },
    get breadcrumb() { return breadcrumb; },
    click(dataset) {
      document.listeners.get('click')({ target: { closest: () => ({ dataset }) }, preventDefault() {} });
    }
  };
}

test('deep lectures cover all eight infection disciplines', () => {
  const app = launch();
  const lessons = app.window.INFECT_LECTURES;
  assert.equal(lessons.length, 39);
  assert.equal(new Set(lessons.map(l => l.category)).size, 8);
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  assert.ok(lessons.every(l => l.sections.length >= 8));
  assert.ok(lessons.every(l => l.sections.every(s => s.title && s.body.length > 30)));
});

test('navigation and reading completion work without breaking quizzes', () => {
  const app = launch();
  assert.match(app.html, /感染症を/);
  app.click({ route: 'lectures' });
  assert.match(app.html, /アミノグリコシド/);
  app.click({ action: 'lecture-open', id: 'L07' });
  assert.match(app.html, /mRNA/);
  assert.match(app.html, /嫌気性菌/);
  app.click({ action: 'lecture-mark', id: 'L07' });
  assert.equal(JSON.parse(app.storage.get('infectlab-v1')).lectures.L07, true);
  app.click({ route: 'library' });
  assert.match(app.html, /問題ライブラリ/);
  app.click({ action: 'start', mode: 'random10' });
  assert.match(app.html, /1 \/ 10/);
  app.click({ action: 'answer', index: '0' });
  assert.match(app.html, /CHECK POINT/);
});

test('lecture display escapes user-facing content', () => {
  const app = launch();
  const x = app.window.LectureUI.list({
    lectures: [{ id: 'x" onclick="evil()', title: '<script>alert(1)</script>', subtitle: '', category: 'basics', sections: [{ title: 'x', body: 'text' }] }],
    categories: [{ id: 'basics', name: '基礎' }],
    header: () => '',
    completed: {},
    filter: 'all'
  });
  assert.ok(!x.includes('<script>'));
  assert.ok(!x.includes('id="x" onclick='));
});

test('script dependencies load in the correct order', () => {
  const html = read('index.html');
  const order = ['questions.js', 'lectures.js', 'lectures-ui.js', 'app.js'];
  const offsets = order.map(s => html.indexOf('src="' + s + '"'));
  assert.ok(offsets.every(x => x !== -1));
  assert.ok(offsets.every((x, i) => i === 0 || x > offsets[i - 1]));
});

test('reader shows scannable chapter sections and mobile contents', () => {
  const app = launch();
  app.click({ route: 'lectures' });
  assert.match(app.html, /reader-library-head/);
  assert.match(app.html, /reader-search/);
  assert.match(app.html, /reader-course-grid/);
  app.click({ action: 'lecture-open', id: 'L07' });
  assert.match(app.html, /reader-mobile-toc/);
  assert.match(app.html, /reader-font-mobile/);
  assert.match(app.html, /reader-goals/);
  assert.match(app.html, /reader-reading-fill/);
  assert.match(app.html, /まず押さえる/);
  assert.ok((app.html.match(/class="reader-prose"/g) || []).length >= 5);
  assert.match(app.html, /嫌気性菌/);
});

test('lecture reader search filters and escapes user-facing text', () => {
  const app = launch();
  const ui = app.window.LectureUI;
  const lessons = app.window.INFECT_LECTURES;
  const categories = [{ id: 'antibiotics', name: '抗菌薬' }];
  const results = ui.list({ lectures: lessons, categories, completed: {}, filter: 'antibiotics', search: 'アミノグリコシド' });
  assert.match(results, /アミノグリコシド/);
  assert.match(results, /2<\/strong> 講義/); // The tetracycline lecture also mentions aminoglycosides
  assert.ok(!results.includes('ペニシリン系をゼロから'));
  const output = ui.detail({
    lectures: [{ id: 'safe', title: '<img src=x onerror=alert(1)>', subtitle: '', category: 'antibiotics', sections: [{ title: '<b>unsafe</b>', body: 'first。second。third。' }] }],
    categories, completed: {}, id: 'safe'
  });
  assert.ok(!output.includes('<img src=x'));
  assert.ok(!output.includes('<b>unsafe</b>'));
  assert.match(output, /first/);
  const paras = ui.paragraphs('背景。要点その1。要点その2。もうひとつ。');
  assert.equal(paras.lead, '背景。');
  assert.equal(paras.body.length, 2);
});

test('responsive reading theme and all scripts are linked', () => {
  const index = read('index.html');
  const css = read('reading-theme.css');
  assert.match(index, /reading-theme.css/);
  assert.match(css, /@media\(max-width:750px\)/);
  assert.match(css, /\.reader-mobile-toc/);
  assert.match(css, /\.reader-prose p/);
  assert.match(css, /\.reader-font-mobile/);
});
