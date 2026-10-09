import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=name=>readFileSync(path.join(root,name),'utf8');
function fixture(saved={}){
 let content='',breadcrumb='';
 const handlers={},cards=[];
 const app={get innerHTML(){return content},set innerHTML(v){content=v}};
 const doc={
  addEventListener(type,fn){handlers[type]=fn},
  getElementById(id){
   if(id==='app')return app;
   if(id==='breadcrumb')return{set textContent(v){breadcrumb=v}};
   if(id==='toast')return{textContent:'',classList:{add(){},remove(){}}};
   if(id==='lecture-match-count')return{set textContent(value){doc.matchCount=+value}};
   if(id==='lecture-no-results')return{set hidden(value){doc.noResultsHidden=value}};
   return null;
  },
  querySelectorAll(selector){return selector==='.reader-course-tile'?cards:[]},
  querySelector(selector){
   if(selector==='.course-shell')return{classList:{toggle(cl,value){doc.fontLarge=value}}};
   return null;
  }
 };
 const storage={getItem:key=>saved[key]??null,setItem:(key,value)=>saved[key]=value};
 const win={scrollTo(){},scrollY:0,innerHeight:800};
 const context=vm.createContext({window:win,document:doc,localStorage:storage,setTimeout:()=>0,clearTimeout(){},confirm:()=>true,console});
 for(const name of ['questions.js','lectures.js','lectures-ui.js','app.js']){
  vm.runInContext(source(name),context,{filename:name});
 }
 return{
  window:win,storage:saved,doc,cards,
  get html(){return content},get breadcrumb(){return breadcrumb},
  click(dataset){handlers.click({target:{closest:()=>({dataset,setAttribute(){},set textContent(v){doc.buttonText=v}})},preventDefault(){}})},
  input(value){handlers.input({target:{id:'lecture-search',value}})}
 };
}
test('theme and font sizes are accessible across desktop/tablet/mobile',()=>{
 const html=source('index.html'),css=source('reading-theme.css');
 assert.ok(html.indexOf('href="reading-theme.css"')>html.indexOf('href="styles.css"'));
 assert.match(css,/@media\(max-width:750px\)/);
 assert.match(css,/@media\(min-width:751px\) and \(max-width:1000px\)/);
 assert.match(css,/\.reader-prose p\{[^}]*font-size:16px/);
 assert.match(css,/\.reader-mobile-toc\{display:block/);
 assert.match(css,/\.reader-course-tile\[hidden\]/);
});
test('long-form lecture keeps natural paragraphs without arbitrary lead breaks',()=>{
 const f=fixture();f.click({route:'lectures'});assert.match(f.html,/reader-library-head/);
 f.click({action:'lecture-open',id:'L07'});
 assert.match(f.html,/reader-hero/);
 assert.match(f.html,/reader-section-label/);
 assert.doesNotMatch(f.html,/class="reader-lead"/);
 assert.match(f.html,/reader-prose/);
 assert.match(f.html,/reader-mobile-toc/);
 assert.match(f.html,/reader-reading-fill/);
 assert.match(f.html,/reader-font-mobile/);
 const result=f.window.LectureUI.paragraphs('第一文。第二文。第三文。第四文。');
 assert.equal(result.lead,'');
 assert.equal(result.body.length,1);
 assert.equal(result.body[0],'第一文。第二文。第三文。第四文。');
 const authored=f.window.LectureUI.paragraphs('第1段落。続く文。\n\n第2段落。');
 assert.equal(authored.body.length,2);
 assert.equal(authored.body[0],'第1段落。続く文。');
 assert.equal(authored.body[1],'第2段落。');
});
test('search filters cards and reports count without changing focus',()=>{
 const f=fixture();f.click({route:'lectures'});
 f.cards.push({dataset:{search:'アミノグリコシド作用機序'},hidden:false},{dataset:{search:'マラリア原虫'},hidden:false});
 f.input('マラリア');
 assert.equal(f.cards[0].hidden,true);
 assert.equal(f.cards[1].hidden,false);
 assert.equal(f.doc.matchCount,1);
 assert.equal(f.doc.noResultsHidden,true);
 f.input('不存在');assert.equal(f.doc.matchCount,0);assert.equal(f.doc.noResultsHidden,false);
});
test('text enlargement works and restores after refresh',()=>{
 const saved={},f=fixture(saved);f.click({route:'lectures'});f.click({action:'lecture-open',id:'L07'});
 f.click({action:'reader-font'});
 assert.equal(saved['infectlab-reader-large'],'1');
 assert.equal(f.doc.fontLarge,true);
 const restored=fixture(saved);restored.click({route:'lectures'});restored.click({action:'lecture-open',id:'L07'});
 assert.match(restored.html,/course-shell reader-detail text-large/);
});
test('existing quiz / reading progress survives UI update',()=>{
 const f=fixture();f.click({route:'lectures'});f.click({action:'lecture-open',id:'L07'});
 f.click({action:'lecture-mark',id:'L07'});
 assert.equal(JSON.parse(f.storage['infectlab-v1']).lectures.L07,true);
 f.click({route:'library'});assert.match(f.html,/問題ライブラリ/);
 f.click({action:'start',mode:'random10'});assert.match(f.html,/1 \/ 10/);
 f.click({action:'answer',index:'0'});assert.match(f.html,/CHECK POINT/);
});
test('lecture metadata is safely escaped in HTML and attributes',()=>{
 const f=fixture();
 const result=f.window.LectureUI.list({
  lectures:[{id:'x" onclick="evil()',category:'basics',title:'<img src=x onerror=evil()>',subtitle:'',sections:[{title:'a',body:'test'}]}],
  categories:[],completed:{},filter:'all'
 });
 assert.ok(!result.includes('<img'));
 assert.ok(!result.includes('id="x" onclick='));
 assert.match(result,/&lt;img/);
});
