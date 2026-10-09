/* INFECT LAB — reader-first lecture interface, zero dependencies */
(() => {
  'use strict';
  const html = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const catName = (id, cats) => cats.find(c => c.id === id)?.name || id;
  const byLine = value => String(value || '').split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
  function sentences(text) {
    // Only reflow the author's existing Japanese prose; never create new medical facts.
    return (String(text).match(/[^。！？\n]+[。！？]?/g) || []).map(s => s.trim()).filter(Boolean);
  }
  function paragraphs(text) {
    const blocks = byLine(text);
    const lines = blocks.flatMap(b => sentences(b));
    if (!lines.length) return { lead: '', body: [] };
    const lead = lines.shift();
    const body = [];
    for (let i = 0; i < lines.length; i += 2) body.push(lines.slice(i, i + 2).join(''));
    return { lead, body };
  }
  function minutes(lesson) {
    const len = lesson.sections.reduce((n, s) => n + s.body.length, 0);
    return Math.max(3, Math.ceil(len / 410));
  }
  const glyph = {basics:'◎',bacteria:'▦',antibiotics:'✳',viruses:'⬡',fungi:'♧',parasites:'◇',diagnostics:'⌕',clinical:'✚'};
  function list({lectures = [], categories = [], header, completed = {}, filter = 'all', search = ''}) {
    const categoryFiltered = lectures.filter(l => filter === 'all' || l.category === filter);
    const query = String(search).trim().toLocaleLowerCase();
    const visible = categoryFiltered.filter(l => (
      [l.title, l.subtitle, ...l.sections.map(s => s.title)].join(' ').toLocaleLowerCase().includes(query)
    ));
    const done = lectures.filter(l => completed[l.id]).length;
    const percentage = lectures.length ? Math.round(done * 100 / lectures.length) : 0;
    return '<div class="course-library">'
      + '<div class="reader-kicker">INFECT LAB / LEARNING LIBRARY</div>'
      + '<div class="reader-library-head"><div><h1>感染症を、<em>理解して覚える。</em></h1>'
      + '<p>細菌・ウイルス・真菌・原虫から抗微生物薬、臨床まで。<br>仕組みを理解するための、医学講義ライブラリ。</p></div>'
      + '<div class="reader-progress-card" aria-label="講義読了 '+done+' / '+lectures.length+'">'
      + '<div class="reader-progress-ring" style="--ring:'+percentage+'%"><span>'+percentage+'<small>%</small></span></div>'
      + '<div><strong>'+done+' / '+lectures.length+' 講義</strong><span>読了した講義</span></div></div></div>'
      + '<div class="reader-library-toolbar"><label class="reader-search"><span aria-hidden="true">⌕</span>'
      + '<input id="lecture-search" type="search" autocomplete="off" placeholder="講義タイトル・キーワードで探す" aria-label="講義を検索" value="'+html(search)+'"></label>'
      + '<div class="reader-result" aria-live="polite"><strong id="lecture-match-count">'+visible.length+'</strong> 講義</div></div>'
      + '<div class="reader-category-tabs" aria-label="講義分野を絞り込み">'
      + '<button data-action="lecture-filter" data-cat="all" class="'+(filter==='all'?'selected':'')+'" aria-pressed="'+(filter==='all')+'">すべて</button>'
      + categories.map(c => '<button data-action="lecture-filter" data-cat="'+html(c.id)+'" class="'+(filter===c.id?'selected':'')+'" aria-pressed="'+(filter===c.id)+'">'+html(c.name)+'</button>').join('')
      + '</div>'
      + '<div class="reader-library-label"><h2>講義一覧</h2><p>短い章に分けてあるので、途中からでも読み進められます。</p></div>'
      + '<div class="course-grid reader-course-grid">'
      + visible.map(l => '<button class="course-tile reader-course-tile" data-action="lecture-open" data-id="'+html(l.id)+'" data-search="'+html([l.title,l.subtitle,...l.sections.map(s=>s.title)].join(' ').toLocaleLowerCase())+'">'
        + '<span class="reader-course-top"><span class="reader-course-icon">'+(glyph[l.category] || '◈')+'</span><span class="reader-course-category">'+html(catName(l.category,categories))+'</span>'
        + (completed[l.id] ? '<span class="reader-done">✓ 読了</span>' : '')+'</span>'
        + '<span class="reader-course-title">'+html(l.title)+'</span>'
        + '<span class="reader-course-description">'+html(l.subtitle)+'</span>'
        + '<span class="reader-course-footer">'+l.sections.length+' セクション <span class="reader-dot">·</span> 約'+minutes(l)+'分'
        + '<span class="reader-course-arrow" aria-hidden="true">↗</span></span></button>').join('')
      + '</div>'
      + '<div id="lecture-no-results" class="reader-empty"'+(visible.length ? ' hidden' : '')+'>一致する講義がありません。検索語や分野を変更してください。</div>'
      + '<p class="reader-disclaimer">学習用の解説です。実際の診療は感染部位、病原体・薬剤感受性、患者背景、最新のガイドラインなどに基づいて判断してください。</p>'
      + '</div>';
  }
  function detail({lectures = [], categories = [], completed = {}, id, largeText = false}) {
    const l = lectures.find(item => item.id === id);
    if (!l) return '<div class="reader-empty">講義が見つかりません。<button class="btn" data-route="lectures">講義一覧に戻る</button></div>';
    const idx = lectures.indexOf(l), prev = lectures[idx - 1], next = lectures[idx + 1];
    const done = Boolean(completed[l.id]);
    const items = l.sections.map((s,i) => '<a href="#lesson-section-'+i+'" class="reader-toc-link" data-lesson-anchor="'+i+'"><span class="reader-toc-number">'+String(i+1).padStart(2,'0')+'</span><span>'+html(s.title)+'</span></a>').join('');
    const chapters = l.sections.map((sec, i) => {
      const ps = paragraphs(sec.body);
      return '<section class="reader-section" id="lesson-section-'+i+'">'
        + '<div class="reader-section-label"><span class="reader-section-marker">'+String(i+1).padStart(2,'0')+'</span>SECTION '+String(i+1).padStart(2,'0')+' / '+String(l.sections.length).padStart(2,'0')+'</div>'
        + '<h2>'+html(sec.title)+'</h2>'
        + (ps.lead ? '<div class="reader-lead"><span class="reader-lead-label">まず押さえる</span><p>'+html(ps.lead)+'</p></div>' : '')
        + '<div class="reader-prose">'+ps.body.map(p=>'<p>'+html(p)+'</p>').join('')+'</div>'
        + '<div class="reader-section-end"><span>SECTION '+String(i+1).padStart(2,'0')+' END</span>'
        + (i+1<l.sections.length ? '<a href="#lesson-section-'+(i+1)+'">次のセクションへ ↓</a>' : '<a href="#lecture-finish">講義のまとめへ ↓</a>')+'</div>'
        + '</section>';
    }).join('');
    return '<div class="course-shell reader-detail'+(largeText?' text-large':'')+'">'
      + '<div class="reader-reading-bar" aria-hidden="true"><div class="reader-reading-fill" id="reader-reading-fill"></div></div>'
      + '<div class="reader-backline"><button data-route="lectures" class="reader-back">← 講義一覧に戻る</button>'
      + '<span>講義 '+String(idx+1).padStart(2,'0')+' / '+lectures.length+'</span></div>'
      + '<header class="reader-hero"><div class="reader-hero-eyebrow">'+html(catName(l.category,categories))+' <span>／</span> '+html(l.id)+'</div>'
      + '<h1>'+html(l.title)+'</h1><p>'+html(l.subtitle)+'</p>'
      + '<div class="reader-hero-meta"><span>◷ 約'+minutes(l)+'分</span><span>▤ '+l.sections.length+'セクション</span>'
      + (done?'<span class="reader-hero-done">✓ 読了済み</span>':'<span>基礎から順番に学ぶ</span>')+'<button class="reader-font-mobile" data-action="reader-font" aria-pressed="'+largeText+'" aria-label="文字を大きくする">'+(largeText?'標準に戻す':'A+ 文字拡大')+'</button></div></header>'
      + '<details class="reader-mobile-toc"><summary>章の目次を開く <span>'+l.sections.length+' セクション</span></summary><nav aria-label="この講義の章一覧">'+items+'</nav></details>'
      + '<div class="reader-layout"><aside class="reader-sidebar"><div class="reader-sidebar-card">'
      + '<div class="reader-side-label">ON THIS PAGE</div><div class="reader-sidebar-heading">この講義の目次</div><nav class="reader-toc" aria-label="この講義の章一覧">'+items+'</nav>'
      + '<div class="reader-side-footer"><span>文字の大きさ</span><button data-action="reader-font" aria-pressed="'+largeText+'" aria-label="文字を大きくする">'+(largeText?'標準に戻す':'A+ 大きく')+'</button></div></div></aside>'
      + '<div class="reader-main"><div class="reader-goals"><span>この講義で学ぶこと</span><ul>'
      + l.sections.slice(0,3).map(sec=>'<li>'+html(sec.title)+'</li>').join('')+'</ul></div>'
      + chapters
      + '<section class="reader-finish" id="lecture-finish"><div class="reader-finish-symbol">✓</div><span>LECTURE COMPLETE</span>'
      + '<h2>ここまで読んだら、問題で確認。</h2><p>覚えるだけでなく、仕組みを自分の言葉で説明できるかがポイント。読了記録はいつでも取り消せます。</p>'
      + '<div class="reader-finish-actions"><button class="btn btn-primary" data-action="lecture-mark" data-id="'+html(l.id)+'">'+(done?'✓ 読了済みを解除':'✓ この講義を読了にする')+'</button>'
      + '<button class="btn btn-primary" data-action="lecture-quiz" data-id="'+html(l.id)+'">この講義の確認テスト（'+(l.questionIds||[]).length+'問） →</button>'
      + '<button class="btn btn-ghost" data-action="category" data-cat="'+html(l.category)+'">この分野の4択問題へ →</button></div></section>'
      + '<div class="reader-neighbors"><div>'+(prev?'<button class="reader-neighbor" data-action="lecture-open" data-id="'+html(prev.id)+'"><span>← 前の講義</span><strong>'+html(prev.title)+'</strong></button>':'')+'</div>'
      + '<div>'+(next?'<button class="reader-neighbor" data-action="lecture-open" data-id="'+html(next.id)+'"><span>次の講義 →</span><strong>'+html(next.title)+'</strong></button>':'')+'</div></div>'
      + '</div></div></div>';
  }
  window.LectureUI = { list, detail, paragraphs };
})();