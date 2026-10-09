/* INFECT LAB — structured course interface (original learning material) */
(() => {
'use strict';
function esc(v){return String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));}
function category(id,categories){return categories.find(c=>c.id===id)?.name||id;}
function list({lectures,categories,header,completed,filter}){
 const shown=lectures.filter(l=>filter==='all'||l.category===filter);
 const done=lectures.filter(l=>completed[l.id]).length;
 return header('IN-DEPTH LECTURES','感染症・講義ライブラリ','正常の仕組み → 病態 → 作用機序 → 検査・診断 → 治療と副作用まで、順番に理解する。')
 + '<div class="course-status"><strong>'+done+' / '+lectures.length+' 講義を読了</strong><span>講義の最後で読了を記録。講義を読んだあとは同じ分野の4択問題に進もう。</span></div>'
 + '<div class="course-filters"><button class="course-filter '+(filter==='all'?'selected':'')+'" data-action="lecture-filter" data-cat="all">すべて ('+lectures.length+')</button>'
 + categories.map(c=>'<button class="course-filter '+(filter===c.id?'selected':'')+'" data-action="lecture-filter" data-cat="'+c.id+'">'+esc(c.name)+'</button>').join('')+'</div>'
 + '<div class="course-grid">'+shown.map(l=>'<button class="course-tile" data-action="lecture-open" data-id="'+esc(l.id)+'"><span class="course-tile-top"><span>'+esc(category(l.category,categories))+'</span><span>'+l.sections.length+' SECTIONS</span></span><strong>'+esc(l.title)+'</strong><small>'+esc(l.subtitle)+'</small><span class="course-tile-bottom">'+(completed[l.id]?'✓ 読了済み':'講義を読む →')+'</span></button>').join('')+'</div>'
 + '<p class="session-note" style="margin-top:20px">医学教育用の概説です。実際の感染症診療は病原体・感受性・感染部位・重症度・患者背景・ガイドラインを踏まえて判断してください。</p>';
}
function detail({lectures,categories,header,completed,id}){
 const lesson=lectures.find(x=>x.id===id);if(!lesson)return '<div class="empty">講義を見つけられませんでした。<button class="btn btn-ghost" data-route="lectures">講義一覧へ戻る</button></div>';
 const pos=lectures.indexOf(lesson),prev=lectures[pos-1],next=lectures[pos+1];
 const done=!!completed[id];
 const toc=lesson.sections.map((section,i)=>'<a href="#lesson-section-'+i+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(section.title)+'</a>').join('');
 const articles=lesson.sections.map((section,i)=>'<section class="course-section" id="lesson-section-'+i+'"><div class="course-section-no">SECTION '+String(i+1).padStart(2,'0')+' / '+String(lesson.sections.length).padStart(2,'0')+'</div><h2>'+esc(section.title)+'</h2><p>'+esc(section.body).replace(/\n/g,'<br>')+'</p></section>').join('');
 return '<div class="course-top"><button class="back" data-route="lectures">← 講義ライブラリに戻る</button><span class="tag">'+esc(category(lesson.category,categories))+'</span></div>'
 +header('DEEP DIVE · '+lesson.id,lesson.title,lesson.subtitle)
 +'<div class="course-layout"><aside class="course-toc"><strong>講義の目次</strong>'+toc+'</aside><div class="course-body">'+articles
 +'<div class="course-complete"><strong>理解したら、クイズで定着。</strong><p>作用機序や鑑別を自分の言葉で説明できるか確認しよう。読了マークはいつでも取り消せます。</p><div class="panel-actions"><button class="btn btn-primary" data-action="lecture-mark" data-id="'+esc(id)+'">'+(done?'✓ 読了を取り消す':'✓ 読了を記録する')+'</button><button class="btn btn-ghost" data-action="category" data-cat="'+esc(lesson.category)+'">この分野の問題へ →</button></div></div>'
 +'<div class="course-next"><span>'+(prev?'<button class="btn btn-ghost btn-sm" data-action="lecture-open" data-id="'+esc(prev.id)+'">← '+esc(prev.title)+'</button>':'')+'</span><span>'+(next?'<button class="btn btn-primary btn-sm" data-action="lecture-open" data-id="'+esc(next.id)+'">'+esc(next.title)+' →</button>':'')+'</span></div>'
 +'</div></div>';
}
window.LectureUI={list,detail};
})();