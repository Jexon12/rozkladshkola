import {z} from 'zod';
import {classes,kyivNow,lessonsForTarget,minutes,type School,type ScheduleTarget} from './school';
import type {PushPayload} from './web-push';
import {getCalendar} from './calendar';
export const pushPreferencesSchema=z.object({
 target:z.union([z.object({classId:z.enum(classes as [string,...string[]]),group:z.enum(['','I','II']).optional()}).strict(),z.object({teacherId:z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/)}).strict()]),
 changes:z.boolean(),reminders:z.boolean(),tomorrow:z.boolean(),eveningTime:z.enum(['18:00','19:00','20:00']).default('19:00'),
}).strict();
export type PushPreferences=z.infer<typeof pushPreferencesSchema>;
export type PlannedPush={key:string;payload:PushPayload;dueAt:number;expiresAt:number};
export function shiftDate(date:string,n:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function targetLabel(s:School,target:ScheduleTarget){return 'classId'in target?`${target.classId} клас${target.group?` · група ${target.group}`:''}`:s.teachers.find(t=>t.id===target.teacherId)?.name||'Учитель';}
function url(target:ScheduleTarget,date:string){const params=new URLSearchParams({date,...('classId'in target?{class:target.classId,...(target.group?{group:target.group}:{})}:{teacher:target.teacherId})});return '/?'+params;}
export function scheduledPushes(s:School,p:PushPreferences,at=new Date()):PlannedPush[]{
 const now=kyivNow(at),stamp=at.getTime(),out:PlannedPush[]=[];
 if(p.reminders){for(const r of lessonsForTarget(s,now.date,p.target)){const start=minutes(r.time[0]),until=start-now.minutes;if(until<=10&&until>0){out.push({key:`lesson:${now.date}:${r.c}:${r.slot}:${r.lesson.group||''}`,payload:{title:'Урок незабаром',body:`${r.c} клас · ${r.lesson.subject} · ${r.time[0]} · каб. ${r.lesson.room||'не вказано'}${r.lesson.group?` · група ${r.lesson.group}`:''}`,tag:`lesson-${now.date}-${r.c}-${r.slot}`,url:url(p.target,now.date)},dueAt:stamp,expiresAt:stamp+(until*60-now.seconds)*1000});}}}
 if(p.tomorrow&&now.minutes>=minutes(p.eveningTime)&&now.minutes<minutes(p.eveningTime)+30){const date=shiftDate(now.date,1),rows=lessonsForTarget(s,date,p.target);if(rows.length){const text=rows.map(r=>`${r.slot+1}. ${'teacherId'in p.target?r.c+' клас · ':''}${r.lesson.subject} ${r.time[0]} (${r.lesson.room||'—'})`).join('\n');out.push({key:`tomorrow:${date}`,payload:{title:`На завтра · ${targetLabel(s,p.target)}`,body:text.slice(0,800),tag:`tomorrow-${date}`,url:url(p.target,date)},dueAt:stamp,expiresAt:stamp+2*60*60*1000});}}
 return out;
}
function signature(s:School,date:string,target:ScheduleTarget){return JSON.stringify(lessonsForTarget(s,date,target).map(r=>({c:r.c,slot:r.slot,lesson:r.lesson,time:r.time})));}
export function scheduleChangePush(before:School,after:School,p:PushPreferences,revision:number,at=new Date()):PlannedPush|null{
 if(!p.changes)return null;const today=kyivNow(at).date,dates=new Set<string>();
 const end=[getCalendar(before).end,getCalendar(after).end].sort().at(-1)!;
 for(let i=0;i<370;i++){const d=shiftDate(today,i);if(d>end)break;dates.add(d);}
 for(const d of [...Object.keys(before.changes),...Object.keys(after.changes)])if(d>=today)dates.add(d);
 for(const v of [...(before.weeklyVersions||[]),...(after.weeklyVersions||[])])if(v.effectiveFrom>=today)for(let i=0;i<7;i++)dates.add(shiftDate(v.effectiveFrom,i));
 const changed=[...dates].sort().filter(d=>signature(before,d,p.target)!==signature(after,d,p.target));if(!changed.length)return null;
 const date=changed[0];return {key:`change:${revision}`,payload:{title:'Розклад змінено',body:`${targetLabel(after,p.target)} · зміни на ${changed.slice(0,3).map(d=>d.slice(8)+'.'+d.slice(5,7)).join(', ')}${changed.length>3?' та інші дні':''}. Відкрийте оновлений розклад.`,tag:`change-${revision}`,url:url(p.target,date)},dueAt:at.getTime(),expiresAt:at.getTime()+24*60*60*1000};
}
