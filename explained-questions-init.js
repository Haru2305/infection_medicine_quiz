/* Editorial rewrite of 102 MCQ explanations. Preserve stem, answer key, labels and progress keys. */
(()=>{
 'use strict';
 const source=window.INFECT_NARRATIVE_EXAM||{};
 const questions=window.QUESTION_BANK||[];
 const coverage=new Set();
 if(questions.length!==102)throw Error('Unexpected MCQ count while installing narrative explanations');
 window.QUESTION_BANK=questions.map(q=>{
   const entry=source[q.id];
   if(!entry)throw Error('Missing educational narrative for question '+q.id);
   if(!Array.isArray(entry.reasons)||entry.reasons.length!==q.options.length)throw Error('Wrong option explanation count: '+q.id);
   if(entry.explanation.length<110)throw Error('Narrative too short: '+q.id);
   if(entry.reasons.some(reason=>reason.length<17))throw Error('Option rationale too short: '+q.id);
   coverage.add(q.id);
   return {...q,explanation:entry.explanation,reasons:[...entry.reasons]};
 });
 if(coverage.size!==Object.keys(source).length)throw Error('Narrative question data contain unknown IDs');
 window.INFECT_NARRATIVE_QUESTION_COVERAGE=coverage.size;
})();
