/* Additional integrated foundations for all non-drug infection topics.
 * Insert after the existing two bridge sections; preserves original lesson IDs, notes,
 * quizzes and main medicine curriculum. */
(() => {
 'use strict';
 const deep=window.INFECT_NONDRUG_DEPTH || {};
 const existing=window.INFECT_LECTURES || [];
 const seen = new Set();
 const updated=existing.map(l=>{
   const extra=deep[l.id];
   if(!extra) return l;
   if(l.curriculumTrack!=='reference')throw Error('Non-drug depth unexpectedly targeted main medicine lecture '+l.id);
   seen.add(l.id);
   return {...l,sections:[
      ...l.sections.slice(0,2),
      ...extra,
      ...l.sections.slice(2)
   ],deepBasicsIntegrated:true};
 });
 if(seen.size!==Object.keys(deep).length)throw Error('Missing reference lessons: '+Object.keys(deep).filter(id=>!seen.has(id)).join(','));
 window.INFECT_LECTURES=updated;
 window.INFECT_SUPPORT_LESSONS=updated.filter(l=>l.curriculumTrack==='reference');
})();
