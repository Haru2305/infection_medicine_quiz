/* Fill remaining dense penicillin prerequisite chapters with original from-zero prose.
   Main L04 is already counted as an edited lesson; only section count increases. */
(()=>{
'use strict';
const edits={"前提：ペプチドグリカンはなぜ必要か":"そもそも、細菌の細胞壁って何を守ってるの？ 細菌の細胞内にはさまざまな溶質があるため、外から水が入ろうとする。柔らかい細胞膜だけでは、この浸透圧による力を支えにくい。そこでペプチドグリカンの丈夫な網目が細胞の形を保つ。\n\n網目はNAGとNAMという糖の繰り返しと、糖鎖同士を結ぶ短いペプチドからできている。PBP（ペニシリン結合タンパク）は壁の架橋などに関わる酵素群。\n\nヒト細胞には細菌のようなペプチドグリカン壁がない。だからここを狙う薬には選択毒性がある。ただしヒトへの副作用が一切ないという意味ではない。","βラクタム環がPBPに結合すると何が起こる":"βラクタム環はペニシリン・セフェム・カルバペネムなどに共通する構造。なぜ重要かというと、PBPの活性部位へ作用して、壁を丈夫にするペプチド架橋の工程を妨げるから。\n\n細菌は増殖・分裂するとき新しい壁を作る必要がある。壁の合成が止まると構造を保ちにくくなり、自己融解酵素の作用なども加わって殺菌効果につながる。\n\n時間依存性とは『投与を長くすれば何でもよい』ではなく、一般に遊離薬物濃度がMICを超える時間（fT>MIC）が効果に関係する性質。そもそも壁がないマイコプラズマには標的がない。","ペニシリンG・アモキシシリン・アンピシリン":"この3つは全部ペニシリン系。PBPを狙う仕組みは共通なのに、なぜ使い分けるの？ 菌への活性、薬が分解されにくいか、経口で吸収されるか、感染部位へ届くかが違うから。\n\nペニシリンGは感受性のレンサ球菌や梅毒などで重要。アモキシシリンは経口で使え、感受性肺炎球菌などを考える場面で登場する。アンピシリンは感受性腸球菌やListeriaを疑う際に重要。\n\n髄膜炎でListeriaが候補なら、一般的なセフトリアキソンだけでは不足しうる。『同じβラクタムだから全部代用可能』ではなく、疑う菌とその感受性で判断しよう。","抗緑膿菌ペニシリンと阻害薬":"ピペラシリンは緑膿菌など一部のGram陰性菌への活性を持つペニシリン。ではタゾバクタムは何のため？ 細菌の一部のβラクタマーゼを阻害し、ピペラシリンが分解されるのを抑えるため。\n\n正常ならβラクタムはPBPへ届いて壁合成を止める。でも菌が分解酵素を作っていると、PBPへ届く前に薬が壊れる。阻害薬はこの問題の一部を補える。\n\nただしMRSAのPBP2aという標的変化や、外膜の障壁などは別問題。ESBL・AmpC・カルバペネマーゼなどにも一律に有効ではない。『阻害薬入り＝万能』と考えない。","耐性の理由は標的変化か薬剤破壊か":"『ペニシリン耐性』は一種類の現象ではない。①標的の細胞壁自体がない、②PBPの形が変わって結合しにくい、③βラクタマーゼで薬が壊される、④外膜を通れない、と分けよう。\n\nMRSAでは低親和性PBP2aが重要。耐性肺炎球菌ではPBPの変化が問題になる場合がある。一方、ESBL産生菌では薬剤を分解する酵素が重要。\n\nここでβラクタマーゼ阻害薬が有効な場合とそうでない場合の差が見えてくる。薬を壊す問題への対策では、変化したPBPを元に戻せるわけではないんだ。","副作用を免疫と腎排泄から理解":"抗菌薬の発疹は全部アレルギー？ 違う。IgEが関わる即時型アレルギーでは、短時間で蕁麻疹・喘鳴・血圧低下などを伴い、アナフィラキシーに至ることがある。一方、数日後の発疹や下痢などは異なる機序の可能性がある。\n\n腎臓は薬を排泄する重要な臓器。多くのペニシリン系では腎機能低下に応じた投与設計が必要になる。正常なら排泄される量が減れば血中濃度が上がり、副作用が問題になる場合がある。\n\nさらに抗菌薬による腸内細菌叢の変化はC. difficile感染につながりうる。菌への効果だけでなく、アレルギー歴・腎機能・消化器症状も見よう。"};
let count=0;
window.INFECT_LECTURES=(window.INFECT_LECTURES||[]).map(l=>{
 if(l.id!=='L04')return l;
 const used=new Set();
 const sections=l.sections.map(s=>{
  if(!Object.prototype.hasOwnProperty.call(edits,s.title))return s;
  if(used.has(s.title))throw Error('Duplicate penicillin section '+s.title);
  used.add(s.title);count++;
  return {...s,body:edits[s.title],teachingVoiceEdited:true};
 });
 for(const title of Object.keys(edits))if(!used.has(title))throw Error('Penicillin leftover not found: '+title);
 return {...l,sections};
});
if(count!==6)throw Error('Expected six remaining sections');
window.INFECT_SUPPORT_LESSONS=window.INFECT_LECTURES.filter(l=>l.curriculumTrack==='reference');
window.INFECT_TEACHING_VOICE_STATS={sections:(window.INFECT_TEACHING_VOICE_STATS?.sections||0)+count,lessons:window.INFECT_TEACHING_VOICE_STATS?.lessons||0};
})();
