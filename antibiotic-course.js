/* INFECT LAB: anti-infective medicines are the top-level curriculum.
   Microbiology, virology, mycology, parasitology and molecular foundations remain
   in the optional reference library, never the primary chapter index. */
(() => {
 'use strict';
 const all = Array.isArray(window.INFECT_LECTURES) ? window.INFECT_LECTURES : [];
 const byId = new Map(all.map(x => [x.id,x]));
 const extras = window.INFECT_ANTIBIOTIC_DEPTH || {};
 const ids = ["L03","L04","L05","L06","L07","L08","L09","L10","L11","L12"];
 const order = ids.map((id,i) => {
   const l=byId.get(id);
   if(!l)throw Error("Missing antibiotic chapter: "+id);
   const bridge = l.sections.slice(0,2);
   const original = l.sections.slice(2);
   return {...l, curriculumTrack:"drugs", drugGroup:"antibacterial", sequence:i+1,
     sections:[...bridge,...(extras[id]||[]),...original],
     prereqs:[] };
 });
 const tb = byId.get("L16");
 const tbLesson = {
   id:"ABTB",category:"antibiotics",curriculumTrack:"drugs",drugGroup:"antibacterial",sequence:order.length+1,
   title:"抗結核薬を機序から理解",subtitle:"イソニアジド・リファンピシン・エタンブトール・ピラジナミドを基礎から",
   questionIds: tb?.questionIds || [],
   sections:[
    {title:"結核菌はなぜ普通の細菌と違うのか",body:"結核菌はミコール酸を含む脂質の多い特殊な細胞壁を持つ抗酸菌で、通常のGram染色だけでは判定しにくい。マクロファージ内で生存でき、細胞性免疫により肉芽腫として封じ込められることがある。\n\n菌が活動的に増殖している場所と増殖が遅い場所が混在し、治療薬の到達・菌の代謝状態・再発リスクを考慮する必要がある。だから短期の単剤治療では不十分。"},
    {title:"ミコール酸とは何か：イソニアジド",body:"結核菌の細胞壁に豊富なミコール酸は、薬剤透過性や乾燥などへの耐性に関わる。イソニアジド（INH）は結核菌内のKatGなどを介して活性化され、ミコール酸合成を阻害する。\n\nヒト細胞には結核菌型のミコール酸合成経路がないため選択毒性が生まれる。肝障害とビタミンB6関連の末梢神経障害が重要な副作用。"},
    {title:"リファンピシン：DNAを読む酵素を止める",body:"DNAは情報を保存し、RNAポリメラーゼがそこからRNAを転写する。リファンピシンは細菌のDNA依存性RNAポリメラーゼを阻害し、転写を止める。\n\n単剤投与では耐性変異を持つ結核菌が選択されやすいため、感受性結核では他の抗結核薬と組み合わせる。強い酵素誘導による薬物相互作用、肝障害、体液の赤橙色化が重要。"},
    {title:"エタンブトール：細胞壁のアラビナン合成",body:"結核菌の細胞壁にはミコール酸と連結したアラビノガラクタンなどが存在する。エタンブトールはアラビノシルトランスフェラーゼを阻害し、細胞壁構築を障害する。\n\n視神経障害と色覚異常が重要な副作用。正常時に色識別ができていたか、投与中に見え方が変わっていないかを確認する。"},
    {title:"ピラジナミド：酸性環境と感染部位",body:"ピラジナミドは菌内のピラジナミダーゼなどによってピラジン酸へ変換される。その効果は病原体・環境の条件に依存し、特に酸性条件における活性が重要とされる。\n\n肝障害、高尿酸血症などに注意する。薬剤がどこでどのように活性化するかも「効くかどうか」の一部。"},
    {title:"なぜ最初から多剤を併用する？",body:"細菌集団には自然の変異で特定薬剤への耐性を持つ菌が少数生じうる。単剤ならその菌が生き残り増えやすい。異なる作用機序の薬を組み合わせることで耐性化を抑え、異なる代謝状態にある菌集団を治療する。\n\n実際の組み合わせ・期間は結核の薬剤感受性、罹患部位、耐性、肝機能などで調整する。"},
    {title:"検査と治療の対応：活動性か潜在性か",body:"抗酸菌塗抹・培養・核酸増幅検査は菌の検出に使い、IGRAは結核菌に対する免疫応答を調べるが活動性結核と潜在性結核感染を区別できない。\n\n活動性結核では菌検査と画像・症候で判断し適切な多剤治療を行う。潜在性結核感染には活動性結核とは異なる予防的治療計画が用いられる。"},
    ...(tb?.sections || []).filter((s,i)=>!s.title.startsWith("ゼロから")&&!s.title.startsWith("なぜ？")).map(s=>({...s,title:"補足｜"+s.title}))
   ]
 };
 const qmap={
 RXV00:["V001","V004"],RXV01:["V005","V012"],RXV02:["V006"],RXV03:["V001","V007"],
 RXV04:["V002","V011"],RXV05:["V003"],RXV06:["V013"],
 RXF00:["M001","M002"],RXF01:["M006","M010"],RXF02:["M007"],RXF03:["M008","M005"],RXF04:["M001","M002"],
 RXP00:["P001","P002","P012"],RXP01:["P003","P004","P008"],RXP02:["P005","P006"],
 RXH00:["P011","P013"],RXH01:["P009"],RXH02:["P011","P013"]
 };
 const additional = (window.INFECT_OTHER_DRUG_MODULES || []).map((l,i)=>({...l,
  curriculumTrack:"drugs",sequence:order.length+2+i,prereqs:[],questionIds:qmap[l.id]||[]
 }));
 const primary = [...order,tbLesson,...additional];
 const mainIDs = new Set(primary.map(x=>x.id));
 if(mainIDs.size !== primary.length)throw Error("Duplicate medication lecture ID");
 const references = all.filter(x=>!mainIDs.has(x.id)).map(x=>({...x,curriculumTrack:"reference"}));
 window.INFECT_LECTURES = [...primary,...references];
 window.INFECT_MEDICINE_MAIN_IDS = primary.map(x=>x.id);
 window.INFECT_ANTIBIOTIC_MAIN_IDS = order.map(x=>x.id).concat(tbLesson.id);
 window.INFECT_SUPPORT_LESSONS = references;
 window.INFECT_DRUG_GROUPS = [
 {id:"antibacterial",name:"抗細菌薬",desc:"βラクタム、リボソーム阻害、抗MRSA薬、抗結核薬"},
 {id:"antiviral",name:"抗ウイルス薬",desc:"ヘルペス、インフルエンザ、HIV、肝炎、COVID-19"},
 {id:"antifungal",name:"抗真菌薬",desc:"アゾール、エキノキャンディン、ポリエン"},
 {id:"antiprotozoal",name:"抗原虫薬",desc:"マラリア、アメーバ・ジアルジア、トキソプラズマ"},
 {id:"antihelminthic",name:"駆虫薬",desc:"ベンズイミダゾール、イベルメクチン、プラジカンテル"}
 ];
})();