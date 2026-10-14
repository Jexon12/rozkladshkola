"use client";
import {ArrowRight,Check,ChevronDown} from 'lucide-react';
import {lessonsForTarget,nextScheduledLesson,minutes,meal,lessonTeacher,lessonChange,describeLesson,countdownTo,lessonNumberKey,type School,type ScheduleTarget,type kyivNow} from '../lib/school';
import {dayTimeline,subjectTone} from '../lib/day-timeline';
import {secondsUntil,durationLabel} from '../lib/lesson-countdown';
export const fullDate=(date:string)=>new Intl.DateTimeFormat('uk-UA',{weekday:'long',day:'numeric',month:'long'}).format(new Date(date+'T12:00:00Z'));
const destinationDay=(date:string)=>['неділі','понеділка','вівторка','середи','четверга','п’ятниці','суботи'][new Date(date+'T12:00:00Z').getUTCDay()];
type Props={school:School;date:string;now:ReturnType<typeof kyivNow>|null;target:ScheduleTarget;numbers:Record<string,number>;onOpenDate:(date:string)=>void};
export default function DayView({school,date,now,target,numbers,onOpenDate}:Props){
 const rows=lessonsForTarget(school,date,target),timeline=dayTimeline(rows),today=now?lessonsForTarget(school,now.date,target):[];
 const current=now?today.filter(r=>minutes(r.time[0])<=now.minutes&&minutes(r.time[1])>now.minutes):[];
 const next=now?nextScheduledLesson(school,now,target):null,focus=current[0]||next,teacherMode='teacherId'in target;
 const nextOnDate=rows.find(r=>date===now?.date&&minutes(r.time[0])>now.minutes);
 const first=rows[0]?.time[0],last=rows.reduce((end,r)=>minutes(r.time[1])>minutes(end)?r.time[1]:end,'00:00');
 const nextAvailable=rows.length?null:nextScheduledLesson(school,{date,time:'00:00',minutes:-1,seconds:0},target);
 const count=rows.length,word=count%10===1&&count%100!==11?'урок':count%10>=2&&count%10<=4&&(count%100<12||count%100>14)?'уроки':'уроків';
 const remaining=now&&next?secondsUntil(next.date,next.time[0],now):0;
 const tomorrow=now?new Date(new Date(now.date+'T12:00:00Z').getTime()+86400000).toISOString().slice(0,10):'';
 const focusWhen=focus?(focus.date===now?.date?'сьогодні':focus.date===tomorrow?'завтра':fullDate(focus.date))+`, ${focus.time[0]}`:'';
 return <div className="compact-day">
  <section className="live-card focus-card compact-focus" aria-label="Зараз і далі">
   <div className="live-card-head"><span><span className="live-dot"/>{current.length?`Зараз · ${now?.time||'—'}`:focus?`Далі · ${focusWhen}`:'Далі'}</span>{focus&&<span className="focus-countdown">{current.length&&now?`До кінця ${durationLabel(secondsUntil(now.date,focus.time[1],now))}`:now?`Через ${durationLabel(remaining)}`:'—'}</span>}</div>
   <div className="compact-focus-body"><div><h2>{focus?(teacherMode?`${focus.c} клас`:focus.lesson.subject):'Найближчих уроків немає'}</h2>{focus&&<p>{teacherMode?focus.lesson.subject:`${focus.c} клас`} · {focus.time.join('–')} · кабінет {focus.lesson.room||'не вказано'}</p>}</div>{focus&&focus.date!==date&&rows.length>0&&<button className="secondary-button" onClick={()=>onOpenDate(focus.date)}>Показати день<ArrowRight size={16}/></button>}</div>
   {focus&&now&&current.length>0&&<progress className="focus-live-progress" aria-label="Час поточного уроку" max={(minutes(focus.time[1])-minutes(focus.time[0]))*60} value={now.minutes*60+now.seconds-minutes(focus.time[0])*60}/>}
   {current.length>1&&<p className="conflict">Одночасно {current.length} уроки — перевірте призначення</p>}
   {current.length>0&&next&&<p className="compact-next">Далі: {teacherMode?`${next.c} клас · `:''}{next.lesson.subject} · {next.time[0]}{next.date!==now?.date&&` · ${fullDate(next.date)}`}</p>}
  </section>
  <section className="panel timeline-panel"><div className="panel-heading"><div><h2>{teacherMode?'Розклад учителя':`${'classId'in target?target.classId:''} клас`}</h2><p>{fullDate(date)}</p></div><span className="day-total-chip">{count} {word}{first&&` · ${first}–${last}`}</span></div>
   {rows.length?<ol className="day-timeline">{timeline.map((item,k)=>{
    if(item.kind==='gap')return <li className={`timeline-gap ${item.duration>25?'is-window':''}`} key={'gap'+k}><span>{item.duration>25?'Вікно':'Перерва'} · {item.duration} хв</span></li>;
    const r=item.row,active=date===now?.date&&minutes(r.time[0])<=now.minutes&&now.minutes<minutes(r.time[1]),upcoming=r===nextOnDate,completed=date===now?.date&&now.minutes>=minutes(r.time[1]);
    const change=lessonChange(school,r.c,date,r.slot),teacher=!teacherMode?lessonTeacher(school,r.lesson,r.c):null,number=numbers[lessonNumberKey(r.c,date,r.slot)];
    return <li key={r.c+'-'+r.slot} className={`timeline-entry tone-${subjectTone(r.lesson.subject)} ${active?'is-current':upcoming?'is-next':''}`}>
     <details className="timeline-card compact-lesson"><summary aria-label={`${r.c} клас, ${r.lesson.subject}, ${r.time.join('–')}, ${r.slot+1}-й урок. Деталі`}>
      <span className="slot-badge">{r.slot+1}</span><span className="compact-lesson-time">{r.time[0]}–{r.time[1]}{active?<small>Триває · {now&&countdownTo(r.time[1],now)}</small>:upcoming?<small>Далі</small>:completed?<Check size={15} aria-label="Завершено"/>:null}</span><span className="compact-lesson-main"><strong>{teacherMode?`${r.c} клас`:r.lesson.subject}</strong><span className="compact-lesson-meta">{teacherMode&&<span className="subject-chip">{r.lesson.subject}</span>}<span>Кабінет {r.lesson.room||'не вказано'}</span>{r.lesson.group&&<span className="group">{r.lesson.group==='Усі'?'Усі групи':`Група ${r.lesson.group}`}</span>}{r.lesson.note&&<span className="group">{r.lesson.note}</span>}{change&&<span className="pill amber">Зміни</span>}</span></span>
<ChevronDown size={16} className="lesson-chevron"/>
      {active&&now&&<progress className="row-live-progress" aria-label={`Прогрес ${r.slot+1}-го уроку`} max={minutes(r.time[1])-minutes(r.time[0])} value={now.minutes-minutes(r.time[0])}/>}
      {item.conflict&&teacherMode&&<span className="conflict compact-conflict">Одночасні уроки — перевірте призначення</span>}
     </summary><div className="compact-lesson-details"><p>{r.slot+1}-й урок{number&&` · №${number} за семестр`}</p>{teacher&&<p>{teacher.name}</p>}{change&&<p>{describeLesson(change.before)} → {describeLesson(change.after)}</p>}{'classId'in target&&<p>Харчування: {meal(target.classId).join('–')}</p>}{!teacher&&teacherMode&&!change&&!number&&<p>{r.lesson.subject} · {r.c} клас · кабінет {r.lesson.room||'не вказано'}</p>}</div></details>
    </li>;
   })}</ol>:<div className="empty helpful-empty"><h3>Оберіть навчальний день</h3>{nextAvailable?<><p>Найближче заняття: {nextAvailable.lesson.subject} · {nextAvailable.time[0]} · {fullDate(nextAvailable.date)}</p><button className="primary-button" onClick={()=>onOpenDate(nextAvailable.date)}>Перейти до {destinationDay(nextAvailable.date)}<ArrowRight size={17}/></button></>:<p>Для цього класу або вчителя ще немає наступних занять. Уточніть розклад у редакторі.</p>}</div>}
  </section>
 </div>;
}
