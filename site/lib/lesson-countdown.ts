import type {kyivNow} from './school';
// Convert a school-local time to an instant, including Kyiv's daylight-saving offset.
export function kyivInstant(date:string,time:string,seconds=0){
 const wall=Date.parse(`${date}T${time}:00Z`)+seconds*1000;
 const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Kyiv',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 let instant=wall;
 for(let i=0;i<3;i++){const p=Object.fromEntries(formatter.formatToParts(new Date(instant)).map(p=>[p.type,p.value]));const local=Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);instant+=wall-local;}
 return instant;
}
export function secondsUntil(date:string,time:string,now:ReturnType<typeof kyivNow>){return Math.max(0,Math.round((kyivInstant(date,time)-kyivInstant(now.date,now.time,now.seconds))/1000));}
export function durationLabel(seconds:number){
 const total=Math.ceil(seconds/60),days=Math.floor(total/1440),hours=Math.floor(total%1440/60),mins=total%60;
 return [days?`${days} дн`:null,hours?`${hours} год`:null,mins||!days&&!hours?`${mins} хв`:null].filter(Boolean).join(' ');
}
