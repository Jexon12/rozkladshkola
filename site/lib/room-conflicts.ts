import {classes,dayLessons,classBells,minutes,type School} from './school';
export function roomConflicts(s:School,dates:string[]){
 return [...new Set(dates)].flatMap(date=>{
  const lessons=classes.flatMap(c=>dayLessons(s,c,date).flatMap((l,slot)=>l?.room?[{c,slot,subject:l.subject,rooms:l.room.toUpperCase().replace(/\s/g,'').split('/'),time:classBells(c)[slot]}]:[]));
  return lessons.flatMap((a,i)=>lessons.slice(i+1).flatMap(b=>{const shared=a.rooms.filter(r=>b.rooms.includes(r));return shared.length&&minutes(a.time[0])<minutes(b.time[1])&&minutes(b.time[0])<minutes(a.time[1])?[{date,room:shared.join('/'),classes:[a.c,b.c],subjects:[a.subject,b.subject],time:[a.time.join('–'),b.time.join('–')]}]:[];}));
 });
}
