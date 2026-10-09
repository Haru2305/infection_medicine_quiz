/* 71 individually authored lecture passages are installed at the relevant mechanistic section.
 * Keep section order, IDs, every other section, associated question IDs and progress intact. */
(()=>{
'use strict';
const overrides=window.INFECT_TUTOR_LECTURE_REWRITES||{};
const original=window.INFECT_LECTURES||[];
if(original.length!==71)throw Error('Unexpected course count '+original.length);
let applied=0;
const updated=original.map(lesson=>{
 const change=overrides[lesson.id];
 if(!change)throw Error('Missing authored tutor response for '+lesson.id);
 const index=change.section;
 if(!Number.isInteger(index)||index<0||index>=lesson.sections.length)throw Error('Missing target section '+lesson.id);
 if(!change.body||change.body.length<290||change.body.split(/\n\s*\n/).length<3)throw Error('Insufficient medical tutor narrative '+lesson.id);
 applied++;
 return {...lesson,sections:lesson.sections.map((sec,i)=>i===index?{...sec,body:change.body,tutorEdited:true}:sec)};
});
if(applied!==Object.keys(overrides).length)throw Error('Tutor edit coverage mismatch');
window.INFECT_LECTURES=updated;
window.INFECT_SUPPORT_LESSONS=updated.filter(l=>l.curriculumTrack==='reference');
window.INFECT_TUTOR_LECTURE_COVERAGE=applied;
})();
