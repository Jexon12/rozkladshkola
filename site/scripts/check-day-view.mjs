import {build} from 'esbuild';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
await build({stdin:{contents:'export {default as DateStrip,DateActions} from "./app/date-strip";export {default as DayView} from "./app/day-view";export * from "./lib/day-timeline";export {seed} from "./lib/school";export * from "./lib/lesson-countdown";',resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',packages:'external',outfile:'.sites-runtime/day-test.mjs'});
const {DayView,DateStrip,DateActions,dayTimeline,seed,secondsUntil,durationLabel}=await import('../.sites-runtime/day-test.mjs');
const row=(slot,start,end)=>({date:'2026-10-05',c:'8',slot,time:[start,end],lesson:{subject:'Фізика',room:'КБ'}});
assert.equal(dayTimeline([]).length,0);
const gap=dayTimeline([row(3,'11:25','12:10'),row(5,'13:15','14:00')]).find(x=>x.kind==='gap');
assert.equal(gap.duration,65);assert.equal(gap.start,'12:10');assert.equal(gap.end,'13:15');
const overlap=dayTimeline([row(0,'08:20','09:05'),row(1,'08:30','08:55'),row(2,'09:15','10:00')]);
assert.ok(overlap[0].conflict&&overlap[1].conflict);assert.equal(overlap[2].duration,10,'Nested lesson does not shorten occupied time');
const school=structuredClone(seed);school.teachers=[{id:'test',name:'Тестовий Учитель',rules:[]}];
school.changes['2026-10-05']={'8':Array.from({length:8},(_,i)=>[0,1,3,5].includes(i)?{subject:i%2?'Інформатика':'Фізика',room:'КБ',teacherId:'test'}:null)};
const now={date:'2026-10-05',time:'08:30',minutes:510,seconds:0};
const html=renderToStaticMarkup(React.createElement(DayView,{school,date:now.date,now,target:{teacherId:'test'},numbers:{},onOpenDate(){}}));
assert.ok(html.includes('is-current'));assert.ok(html.includes('is-next'));assert.ok(html.includes('Вікно'));assert.ok(html.includes('До кінця 35 хв'));assert.ok(!html.includes('Тестовий Учитель'),'Teacher name not repeated in teacher timeline');
const empty=renderToStaticMarkup(React.createElement(DayView,{school,date:'2026-10-04',now:{date:'2026-10-04',time:'12:00',minutes:720,seconds:0},target:{teacherId:'test'},numbers:{},onOpenDate(){}}));
assert.ok(empty.includes('Перейти до понеділка'));assert.ok(!empty.includes('lesson-stats'));
console.log('Day view checks passed: gap duration, overlapping intervals, current/next highlights, teacher deduplication, next-day action.');

assert.equal(secondsUntil('2026-10-25','08:20',{date:'2026-10-24',time:'08:20',minutes:500,seconds:0}),25*3600,'Autumn daylight-saving change');
assert.equal(secondsUntil('2026-03-29','08:20',{date:'2026-03-28',time:'08:20',minutes:500,seconds:0}),23*3600,'Spring daylight-saving change');
assert.equal(durationLabel(4800),'1 год 20 хв');
const waiting=renderToStaticMarkup(React.createElement(DayView,{school,date:now.date,now:{...now,time:'08:00',minutes:480},target:{teacherId:'test'},numbers:{},onOpenDate(){}}));
assert.ok(waiting.includes('Через 20 хв'));assert.ok(!waiting.includes('<progress'),'No waiting progress bar');assert.ok(waiting.includes('Далі · сьогодні, 08:20'));assert.ok(html.includes('Час поточного уроку'));assert.ok(waiting.includes('compact-lesson'));assert.ok(!waiting.includes('day-summary'));
console.log('Countdown checks passed: current/next labels, progress, spring/autumn timezone changes.');

assert.ok(empty.includes('Далі · завтра, 08:20'));assert.ok(!empty.includes('<progress'));

const strip=renderToStaticMarkup(React.createElement(DateStrip,{school,date:'2026-10-05',today:'2026-10-04',target:{teacherId:'test'},onChange(){}}));
assert.ok(strip.includes('class="has-lessons"'));assert.ok(strip.includes('class="no-lessons"'));
assert.ok(!strip.includes('today-marker'),'Today outside selected week is not mislabelled');
const actions=renderToStaticMarkup(React.createElement(DateActions,{date:'2026-10-05',today:'2026-10-04',onChange(){}}));assert.ok(actions.includes('Сьогодні, неділя, 4 жовтня'));assert.ok(actions.includes('4'));
console.log('Date strip checks passed: actual lesson dots, no-lesson days, today outside selected week.');

assert.ok(strip.includes('жовтень 2026'));assert.ok(!strip.includes('2026 р.'));assert.ok(strip.includes('date-legend'));assert.ok(!strip.includes('Наступний тиждень'));
assert.ok(!actions.includes('<small>'),'Today button without repeated date');assert.ok(actions.includes('calendar-icon'));
assert.ok(html.indexOf('compact-lesson-time')<html.indexOf('compact-lesson-main'),'Time beside lesson badge');
assert.ok(!empty.split('<section class="panel timeline-panel"')[0].includes(' · понеділок, 5 жовтня</p>'),'Focus date is not repeated');
