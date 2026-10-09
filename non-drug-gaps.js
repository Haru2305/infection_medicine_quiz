/* Extra bottom-up explanations for concepts directly tested by the existing bank. */
(() => {
'use strict';
const additions={
 L36:[
  {title:"まず基礎｜HPVと子宮頸癌：ウイルスが細胞分裂の制御へ作用する理由",
   body:"ヒトの細胞は、DNAに変異がないかを監視して細胞周期を停止させたり、修復できなければアポトーシスで除去したりする仕組みを持つ。代表的な制御因子にp53やRbがある。\n\n高リスク型ヒトパピローマウイルス（HPV）は持続感染するとE6・E7などのウイルスタンパク質がこれらの制御に干渉し、異形成から子宮頸癌へ進展するリスクを高める。HPV感染自体は多くが自然に消失し、感染＝すぐ癌ではない。HPVワクチン、子宮頸部の適切なスクリーニングは目的が異なり、両者が重要。"}
 ],
 L23:[
  {title:"まず基礎｜クリプトスポリジウムは何をする原虫か",
   body:"小腸は絨毛と微絨毛によって表面積を広げ、栄養と水分を吸収する。Cryptosporidiumは小腸上皮に寄生し、下痢などを起こす原虫で、糞口感染や水系曝露などが重要。塩素消毒に比較的強いオーシストが感染経路を考えるポイントとなる。\n\n免疫が正常なら自然軽快することが多いが、細胞性免疫が低下した患者では持続する大量水様性下痢の原因となる。便抗原・PCR・特殊染色などを用いる。支持療法や免疫機能の回復が重要で、状況によりニタゾキサニド等の治療が検討される。"}
 ],
 L25:[
  {title:"まず基礎｜便検査で何を検出するのか",
   body:"腸管感染の診断で用いる便検査は、病原体の生体や虫卵を顕微鏡で観察するもの、特異的な抗原を検出するもの、核酸増幅検査でDNA/RNAを検出するものなどに分かれる。\n\n原虫や蠕虫の排出量は日によって異なることがあるため、単回の便検査が陰性でも完全には否定できない。水様性下痢・血便・脂肪便など症状と曝露、検体採取時期を考え、適切な検査を選ぶ。"}
 ]
};
const lessons=window.INFECT_LECTURES || [];
const found=new Set();
window.INFECT_LECTURES=lessons.map(l=>{
 if(!additions[l.id]||l.curriculumTrack!=='reference')return l;
 found.add(l.id);
 return {...l,sections:[...l.sections.slice(0,5),...additions[l.id],...l.sections.slice(5)]};
});
if(found.size!==Object.keys(additions).length)throw Error("Concept gap lessons missing");
window.INFECT_SUPPORT_LESSONS=window.INFECT_LECTURES.filter(x=>x.curriculumTrack==='reference');
})();