/* Preserve former prerequisite material, but put its explanation AFTER the relevant
   sentence's topic instead of forcing learners through two prefatory sections. */
(()=>{
'use strict';
const hints={"L01":["感染","発熱"],"L02":["ペプチドグリカン","外膜"],"L03":["薬の","濃度"],"L04":["ペプチドグリカン","耐性"],"L05":["PBP","髄膜炎"],"L06":["カルバペネム","広域"],"L07":["リボソーム","嫌気性"],"L08":["tRNA","鉄"],"L09":["50S","マイコプラズマ"],"L10":["DNA","感染"],"L11":["MRSA","ダプトマイシン"],"L12":["葉酸","メトロニダゾール"],"L13":["カタラーゼ","毒素"],"L14":["外膜","耐性"],"L15":["細胞内","嫌気性"],"L16":["肉芽腫","多剤"],"L17":["ウイルス","RNA"],"L18":["潜伏","チミジン"],"L19":["筋肉痛","ノイラミニダーゼ"],"L20":["逆転写","CD4"],"L21":["真菌","カンジダ"],"L22":["エルゴステロール","真菌"],"L23":["マラリア","検査"],"L24":["原虫","好酸球"],"L25":["培養","感度"],"L26":["伝播","空気"],"L27":["肺胞","重症"],"L28":["腎臓","髄液"],"L29":["血圧","抗菌薬"],"L30":["双球菌","補体"],"L31":["スピロヘータ","RPR"],"L32":["腸管","C. difficile"],"L33":["神経","破傷風"],"L34":["曝露","血管内皮"],"L35":["免疫","ニューモシスチス"],"L36":["胎児","TORCH"],"L37":["ワクチン","受動免疫"],"L38":["弁","バイオフィルム"],"L39":["潜伏期間","マラリア"]};
const source=window.INFECT_LECTURES||[];
window.INFECT_LECTURES=source.map(lesson=>{
 if(!hints[lesson.id])return lesson;
 const bridges=lesson.sections.filter(s=>/^(ゼロから｜|なぜ？｜)/.test(s.title));
 if(bridges.length!==2)return lesson;
 const sections=lesson.sections.filter(s=>!/^(ゼロから｜|なぜ？｜)/.test(s.title)).map(s=>({...s}));
 for(let i=0;i<bridges.length;i++){
  const hint=hints[lesson.id][i];
  let target=sections.findIndex(s=>s.title.includes(hint));
  if(target<0)target=sections.findIndex(s=>s.body.includes(hint));
  if(target<0)target=Math.min(i,sections.length-1);
  sections[target].body+='\n\n'+bridges[i].body;
 }
 return {...lesson,sections,inlineFoundationReflow:true};
});
window.INFECT_SUPPORT_LESSONS=window.INFECT_LECTURES.filter(l=>l.curriculumTrack==='reference');
})();
