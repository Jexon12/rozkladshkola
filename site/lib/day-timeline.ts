import {minutes,type ScheduledLesson} from './school';
export type TimelineItem={kind:'lesson';row:ScheduledLesson;conflict:boolean}|{kind:'gap';start:string;end:string;duration:number};
export function dayTimeline(rows:ScheduledLesson[]):TimelineItem[]{
 const sorted=[...rows].sort((a,b)=>minutes(a.time[0])-minutes(b.time[0])||a.c.localeCompare(b.c));
 const result:TimelineItem[]=[];let end:string|undefined;
 for(const row of sorted){
  if(end&&minutes(row.time[0])>minutes(end))result.push({kind:'gap',start:end,end:row.time[0],duration:minutes(row.time[0])-minutes(end)});
  result.push({kind:'lesson',row,conflict:sorted.some(other=>other!==row&&minutes(other.time[0])<minutes(row.time[1])&&minutes(other.time[1])>minutes(row.time[0]))});
  if(!end||minutes(row.time[1])>minutes(end))end=row.time[1];
 }
 return result;
}
export function subjectTone(subject:string){
 if(/фізик|хімі|природ|біолог/i.test(subject))return 'sage';
 if(/інформ|робото|технолог|stem/i.test(subject))return 'lavender';
 if(/математ|алгебр|геометр/i.test(subject))return 'sand';
 if(/мов|літ|читан|грамот/i.test(subject))return 'rose';
 return 'stone';
}
