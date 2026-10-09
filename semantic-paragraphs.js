/* Hand-selected paragraph boundaries for genuine changes of medical topic.
   No punctuation-driven algorithm: untouched sections remain exactly as authored.
   Every source sentence and character remains unchanged; only blank lines are inserted. */
(()=>{
'use strict';
const positions={
  "L03:7": [
    "30S：アミノグリコシド",
    "DNA：キノロン"
  ],
  "L03:9": [
    "培養・薬剤感受性が判明したら",
    "開始前検体採取が重要だが"
  ],
  "L04:8": [
    "アンピシリンは",
    "ピペラシリン/タゾバクタムは"
  ],
  "L05:7": [
    "第3世代：",
    "第4世代セフェピム"
  ],
  "L07:7": [
    "ヒト細胞質は"
  ],
  "L07:9": [
    "つまり標的の30Sがないからではなく"
  ],
  "L07:10": [
    "重症感染症ではβラクタムとの併用が検討されることがある。",
    "ただしルーチンの併用は"
  ],
  "L07:11": [
    "腎機能・感染症・患者条件によって"
  ],
  "L07:14": [
    "「30S」「好気性Gram陰性桿菌」"
  ],
  "L08:8": [
    "カルシウム、マグネシウム、鉄など",
    "妊娠・小児では"
  ],
  "L09:8": [
    "クリンダマイシンは",
    "薬剤の選択は"
  ],
  "L10:7": [
    "キノロン全体を同じスペクトラムにしない。"
  ],
  "L11:6": [
    "Gram陰性菌には外膜障壁",
    "MRSA感染症で重要だが"
  ],
  "L11:11": [
    "薬が分解される耐性とは別。",
    "VREにはリネゾリドやダプトマイシン等を"
  ],
  "L12:6": [
    "ヒトは通常葉酸を食事から得るため",
    "ニューモシスチス肺炎、"
  ],
  "ABTB:7": [
    "Ziehl–Neelsen染色や蛍光抗酸菌染色"
  ],
  "ABTB:10": [
    "感受性結核の標準的治療は通常"
  ],
  "F01:5": [
    "なぜ真菌には細菌用抗菌薬",
    "なぜウイルスに抗菌薬"
  ],
  "L01:3": [
    "「汚染」は採取時などに混入しただけ"
  ],
  "L01:4": [
    "ウイルスは細胞ではなく",
    "真菌と原虫は真核生物",
    "蠕虫は多細胞寄生虫"
  ],
  "L01:5": [
    "ただし抗菌薬のST合剤が"
  ],
  "L01:8": [
    "やがてT細胞・B細胞による特異的応答が生じる。"
  ],
  "L02:4": [
    "陰性菌：薄いペプチドグリカン層",
    "陰性菌の外膜にはLPSが存在し",
    "陽性球菌にはブドウ球菌・レンサ球菌"
  ],
  "L02:8": [
    "芽胞形成菌",
    "鞭毛は運動性に関与し"
  ],
  "L13:5": [
    "リウマチ熱や感染後糸球体腎炎は",
    "肺炎球菌（S. pneumoniae）は"
  ],
  "L13:6": [
    "表皮ブドウ球菌などのコアグラーゼ陰性ブドウ球菌は"
  ],
  "L14:5": [
    "入院・免疫不全・熱傷・人工呼吸器"
  ],
  "L14:6": [
    "AmpC型βラクタマーゼ",
    "カルバペネマーゼは",
    "ただし菌株・酵素・感染部位ごとに"
  ],
  "L15:5": [
    "培養は特殊培地を要し"
  ],
  "L15:6": [
    "酸素依存的取り込みが必要な",
    "薬剤としてはメトロニダゾール"
  ],
  "L16:3": [
    "Ziehl–Neelsen染色や蛍光抗酸菌染色"
  ],
  "L16:6": [
    "感受性結核の標準的治療は通常"
  ],
  "L17:4": [
    "抗ウイルス薬は特定の段階に介入する。"
  ],
  "L18:4": [
    "感染細胞に選択的に活性化されやすいことが"
  ],
  "L20:3": [
    "CD4細胞が減少すると"
  ],
  "L21:4": [
    "病理所見だけで菌種を確定できるとは限らない。"
  ],
  "L22:3": [
    "薬剤によりカンジダ、アスペルギルス等へのカバーが"
  ],
  "L23:5": [
    "熱帯熱マラリアでは",
    "渡航後発熱では"
  ],
  "L23:6": [
    "検査は便抗原・PCR・鏡検など。"
  ],
  "L24:5": [
    "ステロイドなど免疫抑制下で"
  ],
  "L25:4": [
    "PCRなどの核酸増幅検査は"
  ],
  "L31:7": [
    "治療開始後のJarisch–Herxheimer反応は"
  ],
  "L31:9": [
    "地域と曝露歴によって検査前確率が大きく違う。"
  ]
};
const lessons=window.INFECT_LECTURES||[];
const matched=[];
window.INFECT_LECTURES=lessons.map(lesson=>{
  let changed=false;
  const sections=lesson.sections.map((section,index)=>{
    const key=lesson.id+':'+index, markers=positions[key];
    if(!markers)return section;
    let body=section.body;
    for(const marker of markers){
      // Exactly one occurrence, always within an existing prose block.
      const count=body.split(marker).length-1;
      if(count!==1)throw Error('Editorial paragraph anchor missing or ambiguous: '+key+' '+marker);
      const offset=body.indexOf(marker);
      // Never introduce duplicate paragraph breaks or move existing text.
      const before=body.slice(0,offset);
      if(!before.trim()||/\n\s*\n\s*$/.test(before))throw Error('Editorial paragraph is already present: '+key+' '+marker);
      body=before.replace(/[ \t\r\n]+$/,'')+'\n\n'+body.slice(offset);
      matched.push(key);
    }
    changed=true;
    return {...section,body};
  });
  return changed?{...lesson,sections,semanticParagraphsEdited:true}:lesson;
});
if(matched.length!==64)throw Error('Editorial paragraph coverage mismatch');
window.INFECT_SUPPORT_LESSONS=window.INFECT_LECTURES.filter(l=>l.curriculumTrack==='reference');
window.INFECT_SEMANTIC_PARAGRAPH_EDITS={sections:Object.keys(positions).length,breaks:matched.length};
})();
