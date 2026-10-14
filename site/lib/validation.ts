import { getCalendar } from "./calendar";
import { z } from "zod";
import { classes, classBells, weekday } from "./school";
const str = z.string().trim().max(150);
const lesson = z.object({subject:str.min(1),room:str,group:str.optional(),teacherId:z.string().max(80).optional(),note:str.optional()}).strict().nullable();
const slots = z.array(lesson).length(8);
const calendarDate=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v))&&new Date(v+"T12:00:00Z").toISOString().slice(0,10)===v,"Некоректна дата календаря");
const classScope=z.array(z.enum(classes as [string,...string[]])).max(10);
const period=z.object({label:str.min(1),start:calendarDate,end:calendarDate}).strict();
const calendar=z.object({start:calendarDate,end:calendarDate,semesters:z.array(period).min(1).max(4),breaks:z.array(period.extend({classes:classScope})).max(30),daysOff:z.array(z.object({date:calendarDate,label:str.min(1),classes:classScope}).strict()).max(200),sourceUrl:z.string().max(500).refine(v=>v===""||/^https:\/\//.test(v),"Джерело має бути HTTPS-посиланням"),confirmed:z.boolean()}).strict().superRefine((c,ctx)=>{
 const issue=(message:string)=>ctx.addIssue({code:"custom",message});
 if(c.end<c.start||Date.parse(c.end)-Date.parse(c.start)>370*86400000)issue("Навчальний рік має тривати не більше 370 днів");
 for(const p of [...c.semesters,...c.breaks])if(p.end<p.start||p.start<c.start||p.end>c.end)issue("Періоди мають бути в межах навчального року; початок — не пізніше завершення");
 for(const p of c.daysOff)if(p.date<c.start||p.date>c.end)issue("Ненавчальний день поза навчальним роком");
 c.semesters.forEach((p,i)=>{if(c.semesters.some((q,j)=>j<i&&p.start<=q.end&&p.end>=q.start))issue("Семестри не можуть перетинатися");});
});
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v)) && new Date(v+"T12:00:00Z").toISOString().slice(0,10)===v && weekday(v)>=0 && weekday(v)<=4,"Оберіть навчальний день");
export const schoolSchema = z.object({
 version:z.literal(1), calendar:calendar.optional(), weekly:z.record(z.array(slots).length(5)), weeklyVersions:z.array(z.object({effectiveFrom:calendarDate,label:str.min(1),weekly:z.record(z.array(slots).length(5))}).strict()).max(50).optional(), changes:z.record(date,z.record(slots)),
 teachers:z.array(z.object({id:z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/),name:str.min(3),rules:z.array(z.object({subjects:z.array(str.min(1)).min(1).max(50),classes:z.array(z.enum(classes as [string,...string[]])).min(1).max(10)}).strict()).max(50)}).strict()).max(100)
}).strict().superRefine((s,ctx)=>{
 const issue=(message:string)=>ctx.addIssue({code:"custom",message});
 if(Object.keys(s.weekly).length!==classes.length || classes.some(c=>!s.weekly[c])) issue("Потрібні всі десять класів");
 if(Object.keys(s.changes).length>500) issue("Забагато дат змін");
 const ids=s.teachers.map(t=>t.id); if(new Set(ids).size!==ids.length) issue("Повторюється ідентифікатор учителя");
 const check=(c:string,rows:(z.infer<typeof lesson>)[])=>{
  if(!classes.includes(c)) {issue("Невідомий клас");return;}
  rows.forEach((l,i)=>{if(l && i>=classBells(c).length)issue(`Для ${c} класу немає ${i+1} дзвінка`);if(l?.teacherId && !ids.includes(l.teacherId))issue("Невідомий учитель");});
 };
 Object.entries(s.weekly).forEach(([c,week])=>week.forEach(rows=>check(c,rows)));
 const dates=s.weeklyVersions?.map(v=>v.effectiveFrom)||[];
 if(new Set(dates).size!==dates.length)issue('Для дати може бути лише одна версія розкладу');
 for(const v of s.weeklyVersions||[]){if(Object.keys(v.weekly).length!==classes.length||classes.some(c=>!v.weekly[c]))issue('У версії потрібні всі класи');Object.entries(v.weekly).forEach(([c,week])=>week.forEach(rows=>check(c,rows)));if(v.effectiveFrom<getCalendar(s).start||v.effectiveFrom>getCalendar(s).end)issue('Дата версії поза навчальним роком');}
 Object.values(s.changes).forEach(day=>Object.entries(day).forEach(([c,rows])=>check(c,rows)));
});
