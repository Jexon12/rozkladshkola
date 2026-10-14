export type CalendarPeriod = { label:string; start:string; end:string };
export type SchoolCalendar = { start:string; end:string; semesters:CalendarPeriod[]; breaks:(CalendarPeriod & {classes:string[]})[]; daysOff:{date:string;label:string;classes:string[]}[]; sourceUrl:string; confirmed:boolean };
export const defaultCalendar:SchoolCalendar = {
 start:"2026-09-01",end:"2027-06-30",
 // Editable working boundaries around the example winter break; not a school order.
 semesters:[{label:"І семестр",start:"2026-09-01",end:"2026-12-25"},{label:"ІІ семестр",start:"2027-01-11",end:"2027-06-30"}],
 breaks:[{label:"Осінні канікули",start:"2026-10-26",end:"2026-11-01",classes:[]},{label:"Зимові канікули",start:"2026-12-28",end:"2027-01-10",classes:[]},{label:"Весняні канікули",start:"2027-03-22",end:"2027-03-28",classes:[]}],
 daysOff:[],sourceUrl:"https://www.osvitjanyk.dp.ua/2026/08/27/kalendar-uchitelia/",confirmed:false,
};
export function getCalendar(s:{calendar?:SchoolCalendar}){return s.calendar??defaultCalendar;}
export function semesterForDate(calendar:SchoolCalendar,date:string){return calendar.semesters.find(p=>date>=p.start&&date<=p.end);}
export function nonTeachingReason(calendar:SchoolCalendar,c:string,date:string):string|null {
 const day=new Date(date+"T12:00:00Z").getUTCDay();if(day===0||day===6)return "Вихідний";
 if(date<calendar.start||date>calendar.end)return "Поза навчальним роком";
 const off=calendar.daysOff.find(p=>p.date===date&&(!p.classes.length||p.classes.includes(c)));if(off)return off.label;
 return calendar.breaks.find(p=>date>=p.start&&date<=p.end&&(!p.classes.length||p.classes.includes(c)))?.label??null;
}
