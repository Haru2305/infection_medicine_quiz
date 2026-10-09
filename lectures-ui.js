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
    const groups=window.INFECT_DRUG_GROUPS || [
      {id:'antibacterial',name:'抗細菌薬'},{id:'antiviral',name:'抗ウイルス薬'},
      {id:'antifungal',name:'抗真菌薬'},{id:'antiprotozoal',name:'抗原虫薬'},
      {id:'antihelminthic',name:'駆虫薬'}
    ];
    const hasDrugTrack=lectures.some(l=>l.curriculumTrack==='drugs');
    const primary=hasDrugTrack?lectures.filter(l=>l.curriculumTrack==='drugs'):lectures;
    const references=hasDrugTrack?lectures.filter(l=>l.curriculumTrack==='reference'):[];
    const current=filter==='antibiotics'?'antibacterial':filter;
    const showReference=current==='reference';
    const relevant=showReference?references:primary.filter(l=>current==='all'||l.drugGroup===current||(!hasDrugTrack&&l.category===filter));
    const query=String(search).trim().toLocaleLowerCase();
    const visible=relevant.filter(l=>[l.title,l.subtitle,...l.sections.map(s=>s.title)].join(' ').toLocaleLowerCase().includes(query));
    const done=primary.filter(l=>completed[l.id]).length;
    const percentage=primary.length?Math.round(done*100/primary.length):0;
    const card=l=>'<button class="course-tile reader-course-tile" data-action="lecture-open" data-id="'+html(l.id)+'" data-search="'+html([l.title,l.subtitle,...l.sections.map(s=>s.title)].join(' ').toLocaleLowerCase())+'">'
      +'<span class="reader-course-top"><span class="reader-course-icon">'+(glyph[l.category]||'◈')+'</span>'
      +'<span class="reader-course-category">'+html(showReference?catName(l.category,categories):groups.find(g=>g.id===l.drugGroup)?.name||catName(l.category,categories))+'</span>'
      +(completed[l.id]?'<span class="reader-done">✓ 読了</span>':'')+'</span>'
      +'<span class="reader-course-title">'+html(l.title)+'</span><span class="reader-course-description">'+html(l.subtitle)+'</span>'
      +'<span class="reader-course-footer">'+l.sections.length+' セクション <span class="reader-dot">·</span> 約'+minutes(l)+'分'
      +'<span class="reader-course-arrow" aria-hidden="true">↗</span></span></button>';
    const referenceGroups=categories.length?categories:[...new Set(visible.map(l=>l.category))].map(id=>({id,name:catName(id,categories)}));
    const chunks=showReference
      ? referenceGroups.filter(c=>visible.some(l=>l.category===c.id)).map(c=>{
          const part=visible.filter(l=>l.category===c.id);
          return '<section class="drug-group reference-group" data-ref-category="'+html(c.id)+'">'
            +'<div class="drug-group-heading"><div><span class="drug-group-number">MICROBIOLOGY / FOUNDATIONS</span>'
            +'<h2>'+html(c.name)+'</h2><p>専門用語の意味から、正常な仕組み、病態・検査まで。</p></div><span class="drug-group-count">'+part.length+' 講義</span></div>'
            +'<div class="course-grid reader-course-grid">'+part.map(card).join('')+'</div></section>';
        }).join('')
      : !hasDrugTrack
      ? '<section class="drug-group"><div class="drug-group-heading"><h2>講義一覧</h2></div><div class="course-grid reader-course-grid">'+visible.map(card).join('')+'</div></section>'
      : groups.filter(g=>current==='all'||current===g.id).map((g,i)=>{
          const part=visible.filter(l=>l.drugGroup===g.id);
          return '<section class="drug-group" data-drug-group="'+html(g.id)+'"'+(part.length?'':' hidden')+'>'
            +'<div class="drug-group-heading"><div><span class="drug-group-number">'+String(i+1).padStart(2,'0')+' / '+String(groups.length).padStart(2,'0')+'</span>'
            +'<h2>'+html(g.name)+'</h2><p>'+html(g.desc||'')+'</p></div><span class="drug-group-count">'+part.length+' 講義</span></div>'
            +'<div class="course-grid reader-course-grid">'+part.map(card).join('')+'</div></section>';
        }).join('');
    return '<div class="course-library drug-course-library">'
      +'<div class="reader-kicker">INFECT LAB / ANTI-INFECTIVE PHARMACOLOGY</div>'
      +'<div class="reader-library-head"><div><h1>感染症の薬を、<em>仕組みから。</em></h1>'
      +'<p>抗細菌薬・抗ウイルス薬・抗真菌薬・抗原虫薬・駆虫薬。<br>'
      +'各薬の講義の中で、細胞・生化学・免疫・薬物動態まで遡って学ぶ。</p></div>'
      +'<div class="reader-progress-card" aria-label="主講義読了 '+done+' / '+primary.length+'">'
      +'<div class="reader-progress-ring" style="--ring:'+percentage+'%"><span>'+percentage+'<small>%</small></span></div>'
      +'<div><strong>'+done+' / '+primary.length+' 講義</strong><span>薬理講義の読了</span></div></div></div>'
      +'<div class="drug-course-intro"><strong>薬が主役。前提知識は、各薬の中で全部説明する。</strong>'
      +'<p>「30Sって何？」「膜電位は？」「どうしてその病原体にだけ効く？」を、別の章へ移動しなくても順番に理解できる構成。</p></div>'
      +'<div class="reader-library-toolbar"><label class="reader-search"><span aria-hidden="true">⌕</span>'
      +'<input id="lecture-search" type="search" autocomplete="off" placeholder="薬の系統・薬剤名・作用機序で検索" aria-label="講義を検索" value="'+html(search)+'"></label>'
      +'<div class="reader-result" aria-live="polite"><strong id="lecture-match-count">'+visible.length+'</strong> 講義</div></div>'
      +'<div class="reader-category-tabs" aria-label="薬の分野を絞り込み">'
      +'<button data-action="lecture-filter" data-cat="all" class="'+(current==='all'?'selected':'')+'" aria-pressed="'+(current==='all')+'">すべての薬 ('+primary.length+')</button>'
      +groups.map(g=>'<button data-action="lecture-filter" data-cat="'+html(g.id)+'" class="'+(current===g.id?'selected':'')+'" aria-pressed="'+(current===g.id)+'">'+html(g.name)+'</button>').join('')
      +'<button data-action="lecture-filter" data-cat="reference" class="'+(showReference?'selected':'')+'" aria-pressed="'+showReference+'">補助資料 ('+references.length+')</button>'
      +'</div>'
      + (showReference?'<div class="drug-reference-notice"><strong>補助資料</strong><p>微生物の構造、免疫、臓器生理、疾患、検査まで、用語の定義から順番に学べます。薬剤講義と同じく、必要な前提知識は各講義の本文内で説明しています。</p></div>':'')
      +chunks
      +'<div id="lecture-no-results" class="reader-empty"'+(visible.length?' hidden':'')+'>一致する講義がありません。検索語や分野を変更してください。</div>'
      +'<p class="reader-disclaimer">医学生向け学習資料です。実際の処方は患者背景、薬剤感受性、感染部位、現行ガイドラインを踏まえて判断してください。</p>'
      +'</div>';
  }
  function detail({lectures = [], categories = [], completed = {}, id, largeText = false}) {
    const l = lectures.find(item => item.id === id);
    if (!l) return '<div class="reader-empty">講義が見つかりません。<button class="btn" data-route="lectures">講義一覧に戻る</button></div>';
    const pool=l.curriculumTrack==='drugs'?lectures.filter(x=>x.drugGroup===l.drugGroup&&x.curriculumTrack==='drugs'):lectures.filter(x=>x.curriculumTrack==='reference');
    const groupLessons=pool.length?pool:lectures;
    const idx = groupLessons.indexOf(l), prev = groupLessons[idx - 1], next = groupLessons[idx + 1];
    const done = Boolean(completed[l.id]);
    const items = l.sections.map((s,i) => '<a href="#lesson-section-'+i+'" class="reader-toc-link" data-lesson-anchor="'+i+'"><span class="reader-toc-number">'+String(i+1).padStart(2,'0')+'</span><span>'+html(s.title)+'</span></a>').join('');
    const chapters = l.sections.map((sec, i) => {
      const ps = paragraphs(sec.body);
      return '<section class="reader-section" id="lesson-section-'+i+'">'
        + '<div class="reader-section-label"><span class="reader-section-marker">'+String(i+1).padStart(2,'0')+'</span>'+(sec.title.startsWith('ゼロから｜')||sec.title.startsWith('なぜ？｜')?'PREREQUISITE / ': 'SECTION ')+String(i+1).padStart(2,'0')+' / '+String(l.sections.length).padStart(2,'0')+'</div>'
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
      + '<div class="reader-backline-actions"><button class="reader-font-mobile" data-action="reader-font" aria-pressed="'+largeText+'" aria-label="文字サイズを変更">'+(largeText?'標準文字':'A+ 大きく')+'</button><span>講義 '+String(idx+1).padStart(2,'0')+' / '+groupLessons.length+'</span></div></div>'
      + '<header class="reader-hero"><div class="reader-hero-eyebrow">'+html(catName(l.category,categories))+' <span>／</span> '+html(l.id)+'</div>'
      + '<h1>'+html(l.title)+'</h1><p>'+html(l.subtitle)+'</p>'
      + '<div class="reader-hero-meta"><span>◷ 約'+minutes(l)+'分</span><span>▤ '+l.sections.length+'セクション</span>'
      + (done?'<span class="reader-hero-done">✓ 読了済み</span>':'<span>基礎から順番に学ぶ</span>')+'<button class="reader-font-mobile" data-action="reader-font" aria-pressed="'+largeText+'" aria-label="文字を大きくする">'+(largeText?'標準に戻す':'A+ 文字拡大')+'</button></div></header>'
      + ((l.prereqs||[]).length ? '<div class="prerequisite-map"><div class="prereq-overline">BEFORE YOU START · この講義の土台</div><h2>ここが分からなければ、先に戻れる。</h2><p>専門用語を飛ばさず、必要な細胞生物学・免疫学・薬理学から読み直せます。</p><div class="prereq-links">'+l.prereqs.map(pid=>{const p=lectures.find(x=>x.id===pid);return p?'<button class="prereq-link" data-action="lecture-open" data-id="'+html(p.id)+'"><span>基礎の基礎</span><strong>'+html(p.title)+'</strong><span aria-hidden="true">↗</span></button>':''}).join('')+'</div></div>' : '')
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
      + ((l.questionIds||[]).length ? '<button class="btn btn-primary" data-action="lecture-quiz" data-id="'+html(l.id)+'">この講義の確認テスト（'+l.questionIds.length+'問） →</button>':'')
      + '<button class="btn btn-ghost" data-action="category" data-cat="'+html(l.category)+'">この分野の4択問題へ →</button></div></section>'
      + '<div class="reader-neighbors"><div>'+(prev?'<button class="reader-neighbor" data-action="lecture-open" data-id="'+html(prev.id)+'"><span>← 前の講義</span><strong>'+html(prev.title)+'</strong></button>':'')+'</div>'
      + '<div>'+(next?'<button class="reader-neighbor" data-action="lecture-open" data-id="'+html(next.id)+'"><span>次の講義 →</span><strong>'+html(next.title)+'</strong></button>':'')+'</div></div>'
      + '</div></div></div>';
  }
  window.LectureUI = { list, detail, paragraphs };
})();