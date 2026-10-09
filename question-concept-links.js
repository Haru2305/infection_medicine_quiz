/* Link a solved question to a bottom-up explainer covering the same concept. */
(() => {
 'use strict';
 const lessons=window.INFECT_LECTURES||[];
 const questions=window.QUESTION_BANK||[];
 const overrides={
  F002:"L02",F009:"L01",F010:"L15",F012:"L25",
  V009:"L36",P007:"L23",P014:"L25"
 };
 const links={};
 for(const q of questions){
   let matching=lessons.filter(l=>(l.questionIds||[]).includes(q.id));
   if(overrides[q.id]){
     const explicit=lessons.find(l=>l.id===overrides[q.id]);
     if(explicit)matching=[explicit,...matching.filter(l=>l.id!==explicit.id)];
   }
   // For organism/diagnosis cases prefer relevant detailed non-drug coverage.
   // For drug questions prefer the matched pharmacology lecture.
   const sorted=[...matching].sort((a,b)=>{
     const sa=(a.category===q.category?4:0)+(q.category==="antibiotics"&&a.curriculumTrack==="drugs"?5:0)+(a.curriculumTrack==="reference"?2:0);
     const sb=(b.category===q.category?4:0)+(q.category==="antibiotics"&&b.curriculumTrack==="drugs"?5:0)+(b.curriculumTrack==="reference"?2:0);
     return sb-sa;
   });
   const target=overrides[q.id]?lessons.find(l=>l.id===overrides[q.id]):sorted[0];
   if(!target)continue;
   links[q.id]={id:target.id,title:target.title};
 }
 window.INFECT_QUESTION_CONCEPT_LINKS=links;
})();
