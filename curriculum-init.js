/* INFECT LAB first-principles curriculum. Run after lectures and foundation datasets, before the UI. */
(() => {
  'use strict';
  const main = Array.isArray(window.INFECT_LECTURES) ? window.INFECT_LECTURES : [];
  const roots = Array.isArray(window.INFECT_FOUNDATION_ROOTS) ? window.INFECT_FOUNDATION_ROOTS : [];
  const bridges = window.INFECT_FOUNDATION_BRIDGES || {};
  if (!main.length || !roots.length) return;
  const expanded = main.map(lesson => {
    const bridge = bridges[lesson.id];
    if (!bridge) return lesson;
    return {
      ...lesson,
      prereqs: bridge.prereqs,
      originalSectionCount: lesson.sections.length,
      sections: [...bridge.sections, ...lesson.sections]
    };
  });
  window.INFECT_LECTURES = [...roots.map(l => ({ ...l, prereqs: [], questionIds: [] })), ...expanded];
})();
