"use client";
import {ArrowRight,BookOpen,Calculator,Check,ChevronDown,Globe2,Leaf,Monitor} from 'lucide-react';
import {lessonsForTarget,nextScheduledLesson,minutes,meal,lessonTeacher,lessonChange,describeLesson,countdownTo,lessonNumberKey,type School,type ScheduleTarget,type kyivNow} from '../lib/school';
import {dayTimeline,subjectTone} from '../lib/day-timeline';
import {secondsUntil,durationLabel} from '../lib/lesson-countdown';

export const fullDate=(date:string)=>new Intl.DateTimeFormat('uk-UA',{weekday:'long',day:'numeric',month:'long'}).format(new Date(date+'T12:00:00Z'));
const destinationDay=(date:string)=>['неділі','понеділка','вівторка','середи','четверга','п’ятниці','суботи'][new Date(date+'T12:00:00Z').getUTCDay()];
const subjectIcons={sage:Leaf,lavender:Monitor,sand:Calculator,rose:BookOpen,stone:Globe2};
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
 const FocusIcon=focus?subjectIcons[subjectTone(focus.lesson.subject)]:BookOpen;
 const NextIcon=next?subjectIcons[subjectTone(next.lesson.subject)]:BookOpen;
 return <div className="compact-day">
  <section className="panel timeline-panel" id="day-lessons"><div className="panel-heading"><div><h2>{teacherMode?'Розклад учителя':`${'classId'in target?target.classId:''} клас`}</h2><p>{fullDate(date)}</p></div><span className="day-total-chip">{count} {word}{first&&` · ${first}–${last}`}</span></div>
   {rows.length>0&&<div className="schedule-columns" aria-hidden="true"><span>№</span><span>Час</span><span>{teacherMode?'Клас / предмет':'Предмет'}</span><span>Кабінет</span><span>{teacherMode?'Група':'Учитель'}</span><span/></div>}
   {rows.length?<ol className="day-timeline">{timeline.map((item,k)=>{
    if(item.kind==='gap')return item.duration>25?<li className="timeline-gap is-window" key={'gap'+k}>Вікно · {item.duration} хв</li>:null;
    const r=item.row,active=date===now?.date&&minutes(r.time[0])<=now.minutes&&now.minutes<minutes(r.time[1]),upcoming=r===nextOnDate,completed=date===now?.date&&now.minutes>=minutes(r.time[1]);
    const change=lessonChange(school,r.c,date,r.slot),teacher=!teacherMode?lessonTeacher(school,r.lesson,r.c):null,number=numbers[lessonNumberKey(r.c,date,r.slot)];
    const previous=timeline[k-1],breakMinutes=previous?.kind==='gap'&&previous.duration<=25?previous.duration:0;
    const tone=subjectTone(r.lesson.subject),Icon=subjectIcons[tone];
    return <li key={r.c+'-'+r.slot} className={`timeline-entry tone-${tone} ${active?'is-current':upcoming?'is-next':''}`}>
     <details className="timeline-card compact-lesson"><summary aria-label={`${r.c} клас, ${r.lesson.subject}, ${r.time.join('–')}, ${r.slot+1}-й урок${r.lesson.room?`, кабінет ${r.lesson.room}`:''}${r.lesson.group?`, група ${r.lesson.group}`:''}${breakMinutes?`, перерва перед уроком ${breakMinutes} хвилин`:''}${change?', зміни':''}${active?', триває':''}. Деталі`}>
      <span className="slot-badge">{r.slot+1}</span><span className="compact-lesson-time">{r.time[0]}–{r.time[1]}{breakMinutes>0&&<small className="lesson-break">Перерва {breakMinutes} хв</small>}</span>
      <span className="compact-lesson-main"><span className="lesson-name"><span className="subject-icon" aria-hidden="true"><Icon size={19}/></span><span className="lesson-name-text"><strong>{teacherMode?`${r.c} клас`:r.lesson.subject}</strong>{teacherMode&&<small>{r.lesson.subject}</small>}{!teacherMode&&r.lesson.group&&<small>{r.lesson.group==='Усі'?'Усі групи':`Група ${r.lesson.group}`}</small>}{r.lesson.note&&<small>{r.lesson.note}</small>}</span>{change&&<span className="pill amber">Зміни</span>}{active&&<span className="lesson-live">Зараз · {now&&countdownTo(r.time[1],now)}</span>}{upcoming&&<span className="lesson-upcoming">Далі</span>}{completed&&<Check size={15} aria-label="Завершено"/>}</span>
       <span className="compact-lesson-meta"><span className="lesson-room"><span className="mobile-field-label">Каб. </span>{r.lesson.room||'—'}</span><span className={`lesson-person ${(teacherMode?r.lesson.group:teacher)?'':'is-empty'}`}>{teacherMode?(r.lesson.group?(r.lesson.group==='Усі'?'Усі групи':`Група ${r.lesson.group}`):'—'):(teacher?.name||'—')}</span></span></span>
      <ChevronDown size={16} className="lesson-chevron"/>
      {active&&now&&<progress className="row-live-progress" aria-label={`Прогрес ${r.slot+1}-го уроку`} max={minutes(r.time[1])-minutes(r.time[0])} value={now.minutes-minutes(r.time[0])}/>}
      {item.conflict&&teacherMode&&<span className="conflict compact-conflict">Одночасні уроки — перевірте призначення</span>}
     </summary><div className="compact-lesson-details"><p>{r.slot+1}-й урок{number&&` · №${number} за семестр`}</p>{teacher&&<p>{teacher.name}</p>}{change&&<p>{describeLesson(change.before)} → {describeLesson(change.after)}</p>}{'classId'in target&&<p>Харчування: {meal(target.classId).join('–')}</p>}{!teacher&&teacherMode&&!change&&!number&&<p>{r.lesson.subject} · {r.c} клас · кабінет {r.lesson.room||'не вказано'}</p>}</div></details>
    </li>;
   })}</ol>:<div className="empty helpful-empty"><h3>На цей день уроків немає</h3>{nextAvailable?<><p>Найближче заняття: {nextAvailable.lesson.subject} · {nextAvailable.time[0]} · {fullDate(nextAvailable.date)}</p><button className="primary-button" onClick={()=>onOpenDate(nextAvailable.date)}>Перейти до {destinationDay(nextAvailable.date)}<ArrowRight size={17}/></button></>:<p>Для цього класу або вчителя ще немає наступних занять. Уточніть розклад у редакторі.</p>}</div>}
  </section>
  <aside className="focus-cards" aria-label="Зараз і далі"><section className={`live-card focus-card compact-focus ${current.length?'has-current':'has-next'}`}>
   <div className="live-card-head"><strong>{current.length?'Зараз триває урок':'Найближчий урок'}</strong>{current.length>0&&<span className="live-badge">● ЗАРАЗ</span>}</div>
   {focus?<><div className="focus-lesson"><span className={`subject-icon focus-icon tone-${subjectTone(focus.lesson.subject)}`} aria-hidden="true"><FocusIcon size={24}/></span><div><h2>{focus.lesson.subject}</h2><p>{focus.time.join('–')}</p></div></div>
    {now&&current.length>0&&<progress className="focus-live-progress" aria-label="Час поточного уроку" max={(minutes(focus.time[1])-minutes(focus.time[0]))*60} value={now.minutes*60+now.seconds-minutes(focus.time[0])*60}/>}
    <p className="focus-countdown">{current.length&&now?`До кінця ${durationLabel(secondsUntil(now.date,focus.time[1],now))}`:now?`Далі · ${focusWhen} · Через ${durationLabel(remaining)}`:`Далі · ${focusWhen}`}</p>
    <div className="focus-meta"><span>Кабінет <strong>{focus.lesson.room||'не вказано'}</strong></span><span>Клас <strong>{focus.c}</strong></span></div>
    {focus.date!==date?<button className="focus-action primary-button" onClick={()=>onOpenDate(focus.date)}>Показати день <ArrowRight size={17}/></button>:<a className="focus-action primary-button" href="#day-lessons">Переглянути розклад <ArrowRight size={17}/></a>}
   </>:<p className="focus-empty">Найближчих уроків немає</p>}
   {current.length>1&&<p className="conflict">Одночасно {current.length} уроки — перевірте призначення</p>}
  </section>{current.length>0&&next&&<section className="next-card" aria-label="Наступний урок"><h2>Далі у розкладі</h2><div className="next-lesson"><span className={`subject-icon tone-${subjectTone(next.lesson.subject)}`} aria-hidden="true"><NextIcon size={19}/></span><div><strong>{teacherMode?`${next.c} клас · `:''}{next.lesson.subject}</strong><p>{next.time.join('–')} · кабінет {next.lesson.room||'не вказано'}{next.date!==now?.date&&` · ${fullDate(next.date)}`}</p></div></div>{next.date!==date&&<button className="text-button" onClick={()=>onOpenDate(next.date)}>Показати день <ArrowRight size={16}/></button>}</section>}</aside>
 </div>;
}
