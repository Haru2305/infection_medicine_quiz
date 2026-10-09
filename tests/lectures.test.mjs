import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFileSync(path.join(root,name),'utf8');
const scripts=[
  'questions.js','teaching-voice-quiz-a.js','lectures.js','foundation-roots.js','foundation-bridges-a.js',
  'foundation-bridges-b.js','curriculum-init.js','antibiotic-depth-a.js',
  'antibiotic-depth-b.js','drug-antiviral.js','drug-antifungal.js',
  'drug-antiparasitic.js','antibiotic-course.js','non-drug-depth-a.js',
  'non-drug-depth-b.js','non-drug-course.js','non-drug-gaps.js',
  'question-concept-links.js','first-principles-concepts.js',
  'in-lesson-concepts.js','inline-depth-placement.js','semantic-paragraphs.js','teaching-voice-editorial-a.js','teaching-voice-editorial-b.js','teaching-voice-editorial-c.js','inline-terms-base.js',
  'inline-terms-mechanisms.js','inline-terms-clinical.js','inline-terms-clarify.js','inline-terms-pathogens.js','inline-terms-molecular-gaps.js','inline-terms.js',
  'lectures-ui.js','app.js'
];
function launch(){
  let html='',breadcrumb='';
  const storage=new Map();
  const app={set innerHTML(value){html=value},get innerHTML(){return html}};
  const document={
    listeners:new Map(),
    getElementById(id){
      if(id==='app')return app;
      if(id==='breadcrumb')return{set textContent(value){breadcrumb=value}};
      if(id==='toast')return{set textContent(value){},classList:{add(){},remove(){}}};
      return null;
    },
    querySelectorAll(){return []},
    addEventListener(type,fn){this.listeners.set(type,fn)}
  };
  const window={scrollTo(){}};
  const localStorage={
    getItem:key=>storage.get(key)||null,
    setItem:(key,value)=>storage.set(key,value)
  };
  const context=vm.createContext({window,document,localStorage,setTimeout:()=>0,clearTimeout(){},confirm:()=>true,console});
  for(const name of scripts)vm.runInContext(read(name),context,{filename:name});
  return {
    window,storage,
    get html(){return html},get breadcrumb(){return breadcrumb},
    click(dataset,element=null){
      document.listeners.get('click')({target:{closest:()=>element||({dataset})},preventDefault(){}});
    }
  };
}

test('all medicine classes are main chapters; foundational and infectious disease reference chapters are supplementary',()=>{
  const app=launch(),all=app.window.INFECT_LECTURES;
  const main=all.filter(l=>l.curriculumTrack==='drugs'),refs=all.filter(l=>l.curriculumTrack==='reference');
  assert.equal(main.length,29);
  assert.equal(refs.length,42);
  assert.equal(all.length,71);
  assert.equal(new Set(all.map(l=>l.id)).size,all.length);
  assert.equal(refs.filter(l=>l.level==='foundation').length,13);
  const counts=Object.fromEntries(app.window.INFECT_DRUG_GROUPS.map(g=>[g.id,main.filter(l=>l.drugGroup===g.id).length]));
  assert.equal(JSON.stringify(counts),JSON.stringify({antibacterial:11,antiviral:7,antifungal:5,antiprotozoal:3,antihelminthic:3}));
  assert.ok(all.every(l=>l.sections.length>=6&&l.sections.every(s=>s.title&&s.body.length>30)));
});

test('each drug course contains its own background biology and deep pharmacology',()=>{
  const all=launch().window.INFECT_LECTURES;
  const byId=Object.fromEntries(all.map(l=>[l.id,l]));
  assert.ok(byId.L07.sections.some(s=>s.body.includes('30S')&&s.body.includes('50S')));
  assert.ok(byId.L07.sections.some(s=>s.body.includes('膜電位')&&s.body.includes('嫌気性菌')));
  assert.ok(byId.L04.sections.some(s=>s.body.includes('ペプチドグリカン')&&s.body.includes('PBP')));
  assert.ok(byId.RXV01.sections.some(s=>s.body.includes('チミジンキナーゼ')));
  assert.ok(byId.RXV04.sections.some(s=>s.body.includes('逆転写酵素')));
  assert.ok(byId.RXF01.sections.some(s=>s.body.includes('CYP51')));
  assert.ok(byId.RXF02.sections.some(s=>s.body.includes('グルカン')));
  assert.ok(byId.RXP00.sections.some(s=>s.body.includes('G6PD')));
  assert.ok(byId.RXH01.sections.some(s=>s.body.includes('Clチャネル')));
  assert.ok(byId.RXH02.sections.some(s=>s.body.includes('Ca2+')));
});

test('drug chapters connect only to existing 4-choice quiz question IDs',()=>{
  const app=launch();
  const ids=new Set(app.window.QUESTION_BANK.map(q=>q.id));
  for(const l of app.window.INFECT_LECTURES.filter(x=>x.curriculumTrack==='drugs')){
    assert.ok((l.questionIds||[]).every(id=>ids.has(id)),l.id+' has invalid quiz ID');
    assert.ok((l.questionIds||[]).length>=1,l.id+' lacks linked practice');
  }
  assert.equal(app.window.QUESTION_BANK.length,102);
});

test('library primarily lists medicines and keeps reference chapters out of main view',()=>{
  const app=launch();
  assert.match(app.html,/感染症の薬を/);
  app.click({route:'lectures'});
  assert.match(app.html,/感染症の薬を/);
  assert.match(app.html,/すべての薬 \(29\)/);
  for(const name of ['抗細菌薬','抗ウイルス薬','抗真菌薬','抗原虫薬','駆虫薬'])assert.match(app.html,new RegExp(name));
  assert.match(app.html,/アミノグリコシド系/);
  assert.match(app.html,/アシクロビル/);
  assert.match(app.html,/イベルメクチン/);
  assert.doesNotMatch(app.html,/DNA→RNA→タンパク質を完全理解/);
  assert.match(app.html,/補助資料 \(42\)/);
  app.click({action:'lecture-filter',cat:'reference'});
  assert.match(app.html,/DNA→RNA→タンパク質を完全理解/);
});

test('opening drug lessons presents inline deep physiology, not a mandatory prerequisite link',()=>{
  const app=launch();
  app.click({action:'lecture-open',id:'L07'});
  assert.match(app.html,/70Sリボソームを数字から理解/);
  assert.match(app.html,/膜電位/);
  assert.match(app.html,/reader-mobile-toc/);
  assert.match(app.html,/reader-reading-fill/);
  assert.doesNotMatch(app.html,/BEFORE YOU START/);
  app.click({action:'lecture-open',id:'RXV01'});
  assert.match(app.html,/DNAポリメラーゼ/);
  assert.match(app.html,/チミジンキナーゼ/);
  app.click({action:'lecture-open',id:'RXF03'});
  assert.match(app.html,/エルゴステロール/);
});

test('lecture read state and existing quiz session remain intact',()=>{
  const app=launch();
  app.click({action:'lecture-open',id:'RXP00'});
  app.click({action:'lecture-mark',id:'RXP00'});
  assert.equal(JSON.parse(app.storage.get('infectlab-v1')).lectures.RXP00,true);
  app.click({route:'library'});
  assert.match(app.html,/問題ライブラリ/);
  app.click({action:'start',mode:'random10'});
  assert.match(app.html,/1 \/ 10/);
  app.click({action:'answer',index:'0'});
  assert.match(app.html,/CHECK POINT/);
});

test('medicine specific filters and search do not expose unrelated chapters',()=>{
  const app=launch(),ui=app.window.LectureUI,all=app.window.INFECT_LECTURES;
  const result=ui.list({lectures:all,categories:[],completed:{},filter:'antiviral',search:'アシクロビル'});
  assert.match(result,/アシクロビル/);
  assert.match(result,/reader-course-grid/);
  assert.doesNotMatch(result,/イベルメクチン/);
  assert.doesNotMatch(result,/ペニシリン系をゼロから/);
  const references=ui.list({lectures:all,categories:[],completed:{},filter:'reference'});
  assert.match(references,/DNA→RNA→タンパク質を完全理解/);
});

test('all displayed lesson metadata is escaped and paragraphs render safely',()=>{
  const app=launch();
  const html=app.window.LectureUI.list({
    lectures:[{id:'x" onclick="evil()',title:'<script>alert(1)</script>',subtitle:'',category:'basics',sections:[{title:'x',body:'text'}]}],
    categories:[{id:'basics',name:'基礎'}],completed:{},filter:'all'
  });
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('id="x" onclick='));
  const output=app.window.LectureUI.detail({
    lectures:[{id:'safe',title:'<img src=x onerror=alert(1)>',subtitle:'',category:'basics',sections:[{title:'<b>unsafe</b>',body:'first。second。third。'}]}],
    categories:[],completed:{},id:'safe'
  });
  assert.ok(!output.includes('<img src=x'));
  assert.ok(!output.includes('<b>unsafe</b>'));
  const paras=app.window.LectureUI.paragraphs('背景。要点その1。要点その2。もうひとつ。');
  assert.equal(paras.lead,'');
  assert.deepEqual(Array.from(paras.body),['背景。要点その1。要点その2。もうひとつ。']);
});

test('script dependencies and responsive reader styles load in correct order',()=>{
  const index=read('index.html'),css=read('reading-theme.css');
  const offsets=scripts.map(name=>index.indexOf('src="'+name));
  assert.ok(offsets.every(x=>x!==-1));
  assert.ok(offsets.every((x,i)=>i===0||x>offsets[i-1]));
  assert.match(index,/reading-theme.css/);
  assert.match(css,/\.drug-group-heading/);
  assert.match(css,/@media\(max-width:750px\)/);
  assert.match(css,/\.reader-mobile-toc/);
  assert.match(css,/\.reader-prose p/);
  assert.match(css,/\.reader-font-mobile/);
});

test('all non-drug infection lessons now teach from first principles within their own chapters',()=>{
  const app=launch();
  const nonDrug=app.window.INFECT_LECTURES.filter(l=>l.deepBasicsIntegrated);
  assert.equal(nonDrug.length,29);
  assert.equal(Object.values(app.window.INFECT_NONDRUG_DEPTH).reduce((n,x)=>n+x.length,0),87);
  for(const l of nonDrug){
    assert.ok(l.sections.length>=11,l.id+' is missing in-lesson depth');
    assert.ok(l.sections.filter(s=>s.body.length>=120).length>=3,l.id+' lacks 3 substantial mechanism explanations');
    assert.ok(l.sections.every(s=>s.body.includes('。')),l.id+' does not explain concepts');
  }
  const byId=Object.fromEntries(app.window.INFECT_LECTURES.map(l=>[l.id,l]));
  assert.ok(byId.L02.sections.some(s=>s.body.includes('クリスタルバイオレット')&&s.body.includes('サフラニン')));
  assert.ok(byId.L28.sections.some(s=>s.body.includes('くも膜下腔')&&s.body.includes('髄液')));
  assert.ok(byId.L33.sections.some(s=>s.body.includes('GABA')&&s.body.includes('ボツリヌス')));
  assert.ok(byId.L36.sections.some(s=>s.body.includes('p53')&&s.body.includes('HPV')));
  assert.ok(byId.L23.sections.some(s=>s.body.includes('Cryptosporidium')));
});

test('all 102 existing quiz questions lead to an explanatory lesson without changing answers',()=>{
  const app=launch(),ids=new Set(app.window.INFECT_LECTURES.map(l=>l.id));
  assert.equal(Object.keys(app.window.INFECT_QUESTION_CONCEPT_LINKS).length,102);
  for(const q of app.window.QUESTION_BANK){
    const target=app.window.INFECT_QUESTION_CONCEPT_LINKS[q.id];
    assert.ok(target&&ids.has(target.id),'missing explainer for '+q.id);
    assert.ok(q.reasons.length===4);
  }
  app.click({route:'library'});
  app.click({action:'start',mode:'random10'});
  app.click({action:'answer',index:'0'});
  assert.match(app.html,/WHY\? · ここから理解し直す/);
  assert.match(app.html,/data-action="lecture-open"/);
});

test('a student can open non-drug deep biology and clinical anatomy from the home page',()=>{
  const app=launch();
  assert.match(app.html,/感染症のしくみをゼロから/);
  app.click({action:'lecture-reference'});
  assert.match(app.html,/感染症の基礎/);
  assert.match(app.html,/臨床推論/);
  app.click({action:'lecture-open',id:'L02'});
  assert.match(app.html,/Gram染色は何をしている/);
  app.click({action:'lecture-open',id:'L28'});
  assert.match(app.html,/髄膜と髄液って何のため/);
  app.click({action:'lecture-open',id:'L35'});
  assert.match(app.html,/好中球減少で菌の種類が変わる理由/);
});

test('full course shows help where an unknown word appears, not an upfront STEP 0 block',()=>{
  const app=launch(),chapters=app.window.INFECT_LECTURES;
  const glossary=app.window.InlineTerms;
  assert.equal(chapters.length,71);
  assert.equal(app.window.INFECT_PRIMITIVE_CONCEPTS.length,33);
  assert.equal(glossary.list().length,159);
  for(const lesson of chapters){
    const html=app.window.LectureUI.detail({lectures:chapters,categories:[],completed:{},id:lesson.id});
    assert.doesNotMatch(html,/STEP 0 \/ FIRST PRINCIPLES/,'old upfront STEP 0: '+lesson.id);
    assert.doesNotMatch(html,/id="lesson-first-principles"/,'old glossary before text: '+lesson.id);
    assert.doesNotMatch(html,/class="reader-goals"/,'unnecessary upfront summary: '+lesson.id);
    assert.match(html,/reader-section/);
    assert.match(html,/data-action="term-toggle"/,'no inline help within '+lesson.id);
  }
  assert.equal(chapters.filter(x=>x.curriculumTrack==='drugs').length,29);
  assert.equal(chapters.filter(x=>x.curriculumTrack==='reference').length,42);
});

test('a word is explained precisely at first occurrence, with another prerequisite one click deeper',()=>{
  const app=launch(),render=app.window.InlineTerms.render;
  const result=render('PBPはペプチドグリカンを架橋する。βラクタムがPBPを阻害する。');
  assert.match(result,/PBP<span class="inline-term-question"/);
  assert.match(result,/data-term-id="pbp_detail"/);
  assert.match(result,/data-term-id="pg"/);
  assert.match(result,/data-term-id="osmotic"/);
  const triggers=(result.match(/data-action="term-toggle"/g)||[]).length;
  assert.equal(triggers,3,'one PBP help at its first mention, not twice');
  const next=app.window.InlineTerms.card('pg',1);
  assert.match(next,/NAGとNAM/);
  const deeper=app.window.InlineTerms.card('pbp_detail',2);
  assert.doesNotMatch(deeper,/data-action="term-related"/,'avoid unbounded recursive nesting');
  assert.equal(render('意味のない一般文。'),'意味のない一般文。');
});

test('in-place explanations work for non-drug infections and for quiz choices and rationale',()=>{
  const app=launch(),lectures=app.window.INFECT_LECTURES;
  const examples={L02:['Gram','ペプチドグリカン'],L28:['髄液'],L29:['敗血症'],L35:['好中球'],RXV01:['DNA']};
  for(const [id,words] of Object.entries(examples)){
    const view=app.window.LectureUI.detail({lectures,categories:[],completed:{},id});
    assert.match(view,/data-action="term-toggle"/);
    for(const term of words)assert.ok(view.includes(term),id+' missing '+term);
  }
  const explainable=app.window.QUESTION_BANK.find(q=>[q.question,q.explanation,q.point,...q.reasons]
    .some(str=>app.window.InlineTerms.render(str).includes('data-action="term-toggle"')));
  assert.ok(explainable,'at least one quiz includes terms with inline explanations');
  app.click({route:'library'});
  app.click({action:'single',id:explainable.id});
  app.click({action:'answer',index:'0'});
  assert.match(app.html,/CHECK POINT/);
  assert.match(app.html,/data-action="term-toggle"/);
});

test('inline terminology escapes untrusted text and avoids false Latin acronym matches',()=>{
  const app=launch(),render=app.window.InlineTerms.render;
  const unsafe=render('<img src=x onerror="attack"> PBP <script>bad</script>');
  assert.ok(!unsafe.includes('<img src='));
  assert.ok(!unsafe.includes('<script>'));
  assert.match(unsafe,/&lt;img/);
  assert.match(unsafe,/data-term-id="pbp_detail"/);
  assert.doesNotMatch(render('NOTDNAHERE'),/data-term-id="dnarna"/);
  const repeated=render('PBP、PBP、PBP。');
  assert.equal((repeated.match(/data-action="term-toggle"/g)||[]).length,1);
  assert.match(read('reading-theme.css'),/\.inline-term-trigger:focus-visible/);
  assert.match(read('reading-theme.css'),/@media\(max-width:750px\)/);
});

test('on-demand definitions actually describe the underlying normal-to-disease pathway',()=>{
  const app=launch(),glossary=app.window.InlineTerms;
  const expected=['pbp_detail','pg','anaerobe','csf_glucose','tcell','cytokine','rt','glycol','g6pd','ivermectin'];
  for(const id of expected){
    const term=glossary.get(id);
    assert.ok(term, id+' is undefined');
    for(const key of ['what','normal','why']) assert.ok(term[key]?.length>25,id+' missing '+key);
    const detail=glossary.card(id);
    assert.match(detail,/そもそも何？/);
    assert.match(detail,/正常時は？/);
    assert.match(detail,/なぜ異常・症状につながる？/);
  }
});

test('original two bridge narratives are retained at the relevant topic instead of the lecture top',()=>{
  const app=launch(),lessons=app.window.INFECT_LECTURES;
  const clinical=lessons.filter(l=>/^L\d+$/.test(l.id));
  assert.equal(clinical.length,39);
  for(const l of clinical){
    assert.ok(l.inlineFoundationReflow,l.id+' not reflowed');
    assert.ok(l.sections.every(s=>!s.title.startsWith('ゼロから｜')&&!s.title.startsWith('なぜ？｜')),l.id+' still frontloads standalone bridge chapters');
  }
  const ag=lessons.find(l=>l.id==='L07');
  assert.match(ag.sections[0].title,/70Sリボソーム/);
  assert.ok(ag.sections[0].body.includes('30S'));
  assert.ok(ag.sections.some(s=>s.body.includes('偏性嫌気性菌')));
});

test('a learner can inspect terminology inside a quiz option without submitting the answer',()=>{
  const app=launch(),render=app.window.InlineTerms.render;
  const q=app.window.QUESTION_BANK.find(q=>q.options.some(o=>render(o).includes('data-action="term-toggle"')));
  assert.ok(q,'question bank needs at least one explainable choice');
  app.click({action:'single',id:q.id});
  assert.match(app.html,/data-action="choice-help"/);
  assert.doesNotMatch(app.html,/class="explain-result/);
  const panel={hidden:true,innerHTML:''},attributes={};
  const btn={dataset:{action:'choice-help'},nextElementSibling:panel,setAttribute(k,v){attributes[k]=v}};
  app.click(btn.dataset,btn);
  assert.equal(panel.hidden,false);
  assert.equal(attributes['aria-expanded'],'true');
  assert.doesNotMatch(app.html,/class="explain-result/,'glossary help must not count as answering');
  app.click(btn.dataset,btn);
  assert.equal(panel.hidden,true);
});
test('term and nested prerequisite buttons expand on demand without navigation',()=>{
  const app=launch();
  app.click({action:'lecture-open',id:'L07'});
  const chapter=app.html;
  const moves=[],paragraph={parentElement:{},insertAdjacentElement(position,node){moves.push({position,node})}};
  const panel={hidden:true,innerHTML:'existing definition',classList:{contains(name){return name==='inline-term-content'}}},state={};
  const parent={dataset:{action:'term-toggle',termId:'pbp_detail'},nextElementSibling:panel,
    closest(){return paragraph},setAttribute(k,v){state[k]=v}};
  app.click(parent.dataset,parent);
  assert.equal(panel.hidden,false);
  assert.equal(state['aria-expanded'],'true');
  assert.equal(moves.length,1);
  assert.equal(moves[0].position,'afterend');
  assert.equal(moves[0].node,panel,'open term card after paragraph, not inside its sentence');
  app.click(parent.dataset,parent);
  assert.equal(panel.hidden,true);
  app.click(parent.dataset,parent);
  assert.equal(panel.hidden,false);
  assert.equal(moves.length,1,'reopening does not move the card again');
  assert.equal(app.html,chapter,'opening a definition must not rerender or change route');
  const child={hidden:true,innerHTML:''},related={};
  const button={dataset:{action:'term-related',termId:'pg',depth:'1'},nextElementSibling:child,setAttribute(k,v){related[k]=v}};
  app.click(button.dataset,button);
  assert.equal(child.hidden,false);
  assert.match(child.innerHTML,/ペプチドグリカン/);
  assert.equal(related['aria-expanded'],'true');
});

test('named infection agents and formerly missing mechanisms are explained inline, not as a separate chapter',()=>{
  const app=launch(),glossary=app.window.InlineTerms;
  assert.equal(glossary.list().length,159);
  const tests=[
    ['VRE','vr_enterococci'],['D-Ala-D-Ala','dala'],['C. difficile','clostridioides'],
    ['肺炎球菌','pneumo'],['レジオネラ','legionella'],['HSV','hsv'],
    ['HCV','hcv'],['HBs抗原','hepatitis_serology'],['cccDNA','cccDNA'],
    ['DAA','daa'],['NS5A','ns5a'],['qSOFA','sofa'],
    ['HUS','hus'],['IRIS','iris'],['好酸球','eosinophils']
  ];
  for(const [word,id] of tests){
    const rendered=glossary.render('ここに'+word+'が現れる。');
    assert.match(rendered,new RegExp('data-term-id="'+id+'"'),word+' missing');
    const entry=glossary.get(id);
    assert.ok(entry&&entry.what.length>=25&&entry.normal.length>=25&&entry.why.length>=25,id+' incomplete');
  }
  for(const id of ['L02','L20','L29','L32','L35']){
    const rendered=app.window.LectureUI.detail({lectures:app.window.INFECT_LECTURES,categories:[],completed:{},id});
    assert.match(rendered,/data-action="term-toggle"/);
    assert.doesNotMatch(rendered,/STEP 0 \/ FIRST PRINCIPLES/);
  }
  assert.equal(app.window.INFECT_LECTURES.length,71);
  assert.equal(app.window.QUESTION_BANK.length,102);
});

test('new glossary definitions escape HTML safely and do not create clickable nested answer buttons',()=>{
  const app=launch(),g=app.window.InlineTerms;
  const text=g.render('<script>danger</script> VRE NS5A HCV');
  assert.ok(!text.includes('<script>'));
  assert.match(text,/&lt;script&gt;/);
  assert.match(text,/data-action="term-toggle"/);
  app.click({route:'library'});
  app.click({action:'start',mode:'random10'});
  assert.match(app.html,/class="option/);
  assert.match(app.html,/class="choice-row"/);
});

test('paragraphs preserve author-chosen breaks instead of inventing sentence-based paragraphs',()=>{
  const app=launch(),format=app.window.LectureUI.paragraphs;
  const one='細菌の構造。薬の作用！なぜだろう？ここまで同じ段落。';
  assert.equal(format(one).lead,'');
  assert.equal(format(one).body.length,1);
  assert.equal(format(one).body[0],one);
  const multi='最初の段落。一文目と二文目。\n\n次の段落。検査所見まで。\n\n最後は治療。';
  assert.deepEqual([...format(multi).body],[
    '最初の段落。一文目と二文目。',
    '次の段落。検査所見まで。',
    '最後は治療。'
  ]);
  const windows='前半。\r\n \r\n後半。\r\n\r\n\r\n最後。';
  assert.deepEqual([...format(windows).body],['前半。','後半。','最後。']);
  assert.deepEqual([...format('  \n\n  ').body],[]);
});

test('lecture paragraphs render without arbitrary lead text or mid-sentence divisions',()=>{
  const app=launch(),html=app.window.LectureUI.detail({
    lectures:[{id:'demo',title:'改行検証',subtitle:'段落の検証',category:'basics',sections:[
      {title:'普通の本文',body:'先行文。続く文。\n\n次の段落。さらに続く文。'}
    ]}],
    categories:[],completed:{},id:'demo'
  });
  assert.ok(html.includes('<div class="reader-prose"><p>先行文。続く文。</p><p>次の段落。さらに続く文。</p></div>'));
  assert.ok(!html.includes('class="reader-lead"'));
  assert.ok(!html.includes('<p>先行文。</p>'));
  assert.match(html,/reader-section-end/);
});

test('meaning-based paragraph breaks only occur at selected sections without changing words',()=>{
  const context=vm.createContext({window:{}});
  const stop=scripts.indexOf('semantic-paragraphs.js');
  assert.ok(stop>0);
  for(const file of scripts.slice(0,stop))vm.runInContext(read(file),context,{filename:file});
  const chapters=context.window.INFECT_LECTURES;
  assert.equal(chapters.length,71);
  const original=new Map(chapters.map(l=>[l.id,l.sections.map(s=>s.body)]));
  vm.runInContext(read('semantic-paragraphs.js'),context,{filename:'semantic-paragraphs.js'});
  const modified=context.window.INFECT_LECTURES;
  assert.equal(context.window.INFECT_SEMANTIC_PARAGRAPH_EDITS.sections,43);
  assert.equal(context.window.INFECT_SEMANTIC_PARAGRAPH_EDITS.breaks,64);
  assert.equal(modified.length,71);
  let changed=0,addedBreaks=0;
  for(const l of modified)for(const [i,s] of l.sections.entries()){
    const old=original.get(l.id)[i];
    const removeWhitespace=value=>value.replace(/\s/g,'');
    assert.equal(removeWhitespace(s.body),removeWhitespace(old),l.id+':'+i+': changed original prose');
    if(s.body!==old){
      changed++;
      addedBreaks+=(s.body.match(/\n\s*\n/g)||[]).length-(old.match(/\n\s*\n/g)||[]).length;
      assert.match(s.body,/[。！？]\n\n/,'new breaks must follow a complete medical statement');
    }
  }
  assert.equal(changed,43);
  assert.equal(addedBreaks,64);
  const penicillins=modified.find(l=>l.id==='L04').sections[8].body;
  assert.match(penicillins,/経口薬として使われる。\n\nアンピシリンは/);
  assert.match(penicillins,/文脈で頻出。\n\nピペラシリン/);
  assert.equal(modified.find(l=>l.id==='RXV01').sections[0].body,original.get('RXV01')[0],'existing natural paragraphs stay unchanged');
});
test('lecture HTML uses curated paragraphs while preserving inline term definitions',()=>{
  const app=launch(),lessons=app.window.INFECT_LECTURES;
  const l=lessons.find(x=>x.id==='L05');
  assert.match(l.sections[7].body,/第3世代：/);
  const html=app.window.LectureUI.detail({lectures:lessons,categories:[],completed:{},id:l.id});
  const section=html.slice(html.indexOf('id="lesson-section-7"'),html.indexOf('id="lesson-section-8"'));
  assert.ok((section.match(/<p>/g)||[]).length>=3,'drug-generation comparisons need readable paragraphs');
  assert.ok(html.includes('data-action="term-toggle"'),'in-paragraph definitions must remain available');
  assert.equal(app.window.QUESTION_BANK.length,102);
});

test('authored ChatGPT-like medical explanations cover real paragraphs, not autogenerated filler',()=>{
 const app=launch(),ls=app.window.INFECT_LECTURES,bank=app.window.QUESTION_BANK;
 const targets=['L02','L04','L07','L28','L17','L21','L23','L29'];
 const edited=ls.filter(l=>targets.includes(l.id));
 assert.equal(edited.length,8);
 const rewritten=edited.flatMap(l=>l.sections.filter(s=>s.teachingVoiceEdited));
 assert.equal(app.window.INFECT_TEACHING_VOICE_STATS.sections,75);
 assert.equal(app.window.INFECT_TEACHING_VOICE_STATS.lessons,8);
 assert.equal(rewritten.length,75);
 for(const s of rewritten){
   assert.ok(s.body.length>=160,s.title+' not a complete explanation');
   assert.ok(s.body.includes('。'),s.title+' is not prose');
   assert.ok(!s.body.includes('<script'),s.title+' embeds markup');
 }
 assert.match(ls.find(l=>l.id==='L07').sections.find(s=>s.title==='③ なぜ嫌気性菌に効かない？').body,/30Sまで入りづらい/);
 assert.match(ls.find(l=>l.id==='L28').sections.find(s=>s.title==='髄膜炎：髄液腔での炎症').body,/正常髄液/);
 assert.match(ls.find(l=>l.id==='L17').sections.find(s=>s.title==='細菌との根本的相違').body,/リボソーム/);
 assert.match(ls.find(l=>l.id==='L21').sections.find(s=>s.title==='真菌細胞の構造').body,/ヒト/);
 assert.equal(bank.length,102);
 assert.equal(app.window.INFECT_TEACHING_QB_STATS.authored,19);
 const explanations=bank.filter(q=>q.teachingVoiceEdited);
 assert.equal(explanations.length,19);
 for(const q of explanations){
   assert.ok(q.explanation.length>=80,q.id+' needs actual mechanism');
   assert.equal(q.reasons.length,4);
   assert.ok(q.reasons.every(r=>r.length>=20),q.id+' needs all 4 rationales');
   assert.match(q.reasons[q.answer],/正解/);
   assert.ok(q.reasons.every((r,i)=>i===q.answer||r.startsWith('×')),q.id+' wrong alternatives');
 }
});

test('original QB prompts, answer keys and answer options survive explanatory text rewrite',()=>{
 const originalWindow={};vm.runInNewContext(read('questions.js'),{window:originalWindow},{filename:'questions.js'});
 const app=launch(),before=originalWindow.QUESTION_BANK,after=app.window.QUESTION_BANK;
 assert.equal(before.length,after.length);
 for(let i=0;i<before.length;i++){
  assert.equal(after[i].id,before[i].id);
  assert.equal(after[i].question,before[i].question);
  assert.equal(after[i].answer,before[i].answer);
  assert.deepEqual(Array.from(after[i].options),Array.from(before[i].options));
 }
 app.click({route:'library'});
 app.click({action:'start',mode:'random10'});
 app.click({action:'answer',index:'0'});
 assert.match(app.html,/CHECK POINT/);
});
