"use client";
import {CalendarDays} from 'lucide-react';
import {fullDate} from './day-view';
import {lessonsForTarget,type School,type ScheduleTarget} from '../lib/school';
const shift=(date:string,n:number)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
type DateProps={date:string;today?:string;onChange:(date:string)=>void};
export function DateActions({date,today,onChange}:DateProps){
 return <div className="day-date-actions"><button className="text-button" aria-label={today?`Сьогодні, ${fullDate(today)}`:'Сьогодні'} onClick={()=>today&&onChange(today)}>Сьогодні</button><label className="date-picker calendar-icon" title="Обрати дату"><CalendarDays size={19}/><span className="sr-only">Обрати дату</span><input aria-label="Інша дата" type="date" value={date} onChange={e=>e.target.value&&onChange(e.target.value)}/></label></div>;
}
export default function DateStrip({date,today,onChange,school,target}:DateProps&{school:School;target:ScheduleTarget}){
 const weekday=new Date(date+'T12:00:00Z').getUTCDay(),monday=shift(date,-((weekday+6)%7));
 return <section className="date-strip" aria-label="Дати тижня"><div className="date-strip-heading"><span>{new Intl.DateTimeFormat('uk-UA',{month:'long'}).format(new Date(date+'T12:00:00Z'))+' '+date.slice(0,4)}</span></div><div className="date-strip-days">{['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map((day,i)=>{const d=shift(monday,i),hasLessons=lessonsForTarget(school,d,target).length>0;return <button key={d} className={hasLessons?'has-lessons':'no-lessons'} aria-label={`${fullDate(d)}${d===today?', сьогодні':''}${hasLessons?', є уроки':', без уроків'}`} title={`${hasLessons?'Є уроки':'Без уроків'}${d===today?' · Сьогодні':''}`} aria-pressed={d===date} aria-current={d===today?'date':undefined} onClick={()=>onChange(d)}><span>{day}</span><strong>{Number(d.slice(8))}</strong>{hasLessons&&<i aria-hidden="true"/>}</button>;})}</div><p className="date-legend"><span><i/>Є уроки</span><span><b/>Сьогодні</span><span><em/>Обрано</span></p></section>;
}
