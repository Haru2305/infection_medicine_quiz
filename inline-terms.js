/* Contextual, point-of-need explanations. No added chapters or upfront glossary. */
(()=>{
'use strict';
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const all=window.INFECT_TERM_ENTRIES||[];
const byId=new Map(all.map(c=>[c.id,c]));
const options=new Map();
for(const c of all){for(const a of c.aliases||[]){const alias=String(a).trim();if(alias&&alias.length>=2)options.set(alias.toLocaleLowerCase(),{alias,entry:c});}}
const terms=[...options.values()].sort((a,b)=>b.alias.length-a.alias.length);
const regexEscape=s=>[...s].map(c=>'\\^$.*+?()[]{}|'.includes(c)?'\\'+c:c).join('');
const expression=new RegExp(terms.map(t=>regexEscape(t.alias)).join('|'),'gi');
const relatedMap={
 wall:['pg','pbp_detail','osmotic'],osmotic:['membrane','wall'],gram:['pg','gram_pos','gram_neg'],
 ribosome:['trna','dnarna'],atp:['membrane','anaerobe'],innate:['phagocyte','neutrophils'],
 tcell:['antibody','pneumocystis'],antibody:['opson','serology'],complement:['opson','encap'],
 airway:['shunt','alveolar_macrophage'],csf:['anatomy_meninges','csf_glucose','lumbar_puncture'],
 kidney:['gfr','ureter'],hemodynamics:['sepsis','lactate'],pharm:['mic','auc','tdm'],
 virus:['viral_latency','dna_poly'],fungus:['glycol','glucan'],parasite:['protozoan_stages','worm_stages'],
 resistance:['betalactamase','mrsa','porin'],test:['blood_culture','contamination','antibiogram'],
 dnarna:['trna','dna_poly','rt']
};
for(const c of all){const additions=relatedMap[c.id]||[];c.related=[...new Set([...(c.related||[]),...additions])].filter(id=>byId.has(id)&&id!==c.id).slice(0,4);}
function card(id,depth=0){
  const c=byId.get(id);
  if(!c)return '';
  const parts=[
    ['そもそも何？',c.what],
    ['正常時は？',c.normal],
    ['なぜ異常・症状につながる？',c.why]
  ];
  if(c.qb)parts.push(['QBでは何が重要？',c.qb]);
  return '<span class="inline-term-card"><span class="inline-term-card-title">'+escapeHtml(c.title||c.aliases[0])+'</span>'
    +parts.filter(([_,value])=>value).map(([label,value])=>'<span class="inline-term-step"><strong>'+escapeHtml(label)+'</strong><span>'+escapeHtml(value)+'</span></span>').join('')
    +(depth<2&&c.related?.length?'<span class="inline-term-next"><strong>ここも分からなければ：</strong>'
       +c.related.map(r=>{const x=byId.get(r);return '<span class="inline-term-related-item"><button type="button" class="inline-term-related-button" data-action="term-related" data-term-id="'+escapeHtml(r)+'" data-depth="'+(depth+1)+'" aria-expanded="false">'+escapeHtml(x.title||x.aliases[0])+' <span aria-hidden="true">＋</span></button><span class="inline-term-related-content" hidden></span></span>';}).join('')
      +'</span>':'')
    +'</span>';
}
function render(value,{limit=6}={}){
  const text=String(value??'');
  if(!text||!terms.length)return escapeHtml(text);
  expression.lastIndex=0;
  const found=new Set();let result='',offset=0,count=0,m;
  while((m=expression.exec(text))!==null){
    if(count>=limit)break;
    const literal=m[0],idx=m.index;
    const preceding=text[idx-1]||'',following=text[idx+literal.length]||'';
    // No matches for an acronym in the middle of another Latin token.
    const latin=/^[A-Za-z0-9]+$/u.test(literal);
    if(latin&&(/[A-Za-z0-9]/.test(preceding)||/[A-Za-z0-9]/.test(following)))continue;
    const term=options.get(literal.toLocaleLowerCase())?.entry;
    if(!term||found.has(term.id))continue;
    found.add(term.id);count++;
    result+=escapeHtml(text.slice(offset,idx));
    result+='<span class="inline-term"><button type="button" class="inline-term-trigger" data-action="term-toggle" data-term-id="'+escapeHtml(term.id)+'" aria-expanded="false" aria-label="'+escapeHtml(literal)+'の意味と仕組みを説明する">'+escapeHtml(literal)+'<span class="inline-term-question" aria-hidden="true">?</span></button>'
      +'<span class="inline-term-content" hidden>'+card(term.id)+'</span></span>';
    offset=idx+literal.length;
  }
  result+=escapeHtml(text.slice(offset));
  return result;
}
function find(value,limit=2){
  const text=String(value??'');
  expression.lastIndex=0;
  const matches=[],seen=new Set();
  let m;
  while((m=expression.exec(text))!==null&&matches.length<limit){
    const literal=m[0],idx=m.index;
    const latin=/^[A-Za-z0-9]+$/u.test(literal);
    if(latin&&(/[A-Za-z0-9]/.test(text[idx-1]||'')||/[A-Za-z0-9]/.test(text[idx+literal.length]||'')))continue;
    const c=options.get(literal.toLocaleLowerCase())?.entry;
    if(c&&!seen.has(c.id)){seen.add(c.id);matches.push({id:c.id,title:c.title||literal,word:literal});}
  }
  return matches;
}
window.InlineTerms={render,card,find,get:id=>byId.get(id),list:()=>[...byId.values()]};
})();