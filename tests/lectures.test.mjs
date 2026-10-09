import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFileSync(path.join(root,name),'utf8');
const scripts=[
  'questions.js','lectures.js','foundation-roots.js','foundation-bridges-a.js',
  'foundation-bridges-b.js','curriculum-init.js','antibiotic-depth-a.js',
  'antibiotic-depth-b.js','drug-antiviral.js','drug-antifungal.js',
  'drug-antiparasitic.js','antibiotic-course.js','non-drug-depth-a.js',
  'non-drug-depth-b.js','non-drug-course.js','non-drug-gaps.js',
  'question-concept-links.js','first-principles-concepts.js',
  'in-lesson-concepts.js','lectures-ui.js','app.js'
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
    click(dataset){
      document.listeners.get('click')({target:{closest:()=>({dataset})},preventDefault(){}});
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
  assert.equal(paras.lead,'背景。');
  assert.equal(paras.body.length,2);
});

test('script dependencies and responsive reader styles load in correct order',()=>{
  const index=read('index.html'),css=read('reading-theme.css');
  const offsets=scripts.map(name=>index.indexOf('src="'+name+'"'));
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
    assert.ok(l.sections.length>=13,l.id+' is missing in-lesson depth');
    assert.ok(l.sections.slice(2,5).every(s=>s.body.length>=120),l.id+' is too superficial');
    assert.ok(l.sections.slice(2,5).every(s=>s.body.includes('。')),l.id+' does not explain concepts');
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

test('STEP 0 provides true first-principles explanations inside every medication and non-medication lesson',()=>{
  const app=launch(),chapters=app.window.INFECT_LECTURES;
  const concepts=app.window.INFECT_PRIMITIVE_CONCEPTS;
  assert.equal(chapters.length,71);
  assert.equal(concepts.length,33);
  assert.equal(new Set(concepts.map(c=>c.id)).size,33);
  const ids=new Set(concepts.map(c=>c.id));
  for(const c of concepts){
    for(const key of ['zero','normal','abnormal'])assert.ok(c[key].length>70,c.id+':'+key);
    assert.ok(c.qb.length>=35,c.id+':qb');
  }
  for(const chapter of chapters){
    assert.ok(chapter.primitiveKeys.length>=3,chapter.id+' lacks bottom-level explanations');
    for(const key of chapter.primitiveKeys)assert.ok(ids.has(key),chapter.id+': invalid concept '+key);
    const html=app.window.LectureUI.detail({lectures:chapters,categories:[],completed:{},id:chapter.id});
    assert.match(html,/STEP 0 \/ FIRST PRINCIPLES/);
    assert.match(html,/そもそも、何の話なのか？/);
    assert.match(html,/① そもそも何？/);
    assert.match(html,/② 正常時はどうなっている？/);
    assert.match(html,/③ 異常が起きると何が変わる？/);
    assert.match(html,/④ だからQBではここを考える/);
    assert.match(html,/class="primitive-card" open/);
    assert.match(html,/lesson-first-principles/);
  }
  assert.deepEqual([...chapters.filter(x=>x.curriculumTrack==='drugs')].length,[...Array(29)].length);
  assert.equal(chapters.filter(x=>x.curriculumTrack==='reference').length,42);
});

test('foundational explanations respond to the topic rather than repeating one generic paragraph',()=>{
  const app=launch(),lessons=app.window.INFECT_LECTURES;
  const read=id=>app.window.LectureUI.detail({lectures:lessons,categories:[],completed:{},id});
  assert.match(read('L02'),/Gram染色はどうして紫・赤に分かれる？/);
  assert.match(read('L28'),/髄膜・髄液・血液脳関門とは何？/);
  assert.match(read('L29'),/血圧・心拍出量・血管抵抗をゼロから/);
  assert.match(read('L35'),/CD4・CD8・MHCは何をしている？/);
  assert.match(read('RXV01'),/ウイルスは「細菌の小さい版」ではない/);
  assert.match(read('L07'),/30S・50S・翻訳をゼロから/);
  const css=readFileSync(path.join(root,'reading-theme.css'),'utf8');
  assert.match(css,/\.primitive-card:focus-visible|\.primitive-card summary:focus-visible/);
  assert.match(css,/@media\(max-width:750px\)/);
});
