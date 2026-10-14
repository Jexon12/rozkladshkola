import {getCalendar, defaultCalendar, nonTeachingReason, type SchoolCalendar} from "./calendar";
export const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9-А", "9-Б"];
export const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця"];
export const rooms: Record<string, string> = { УМ: "Української мови", Г: "Географії", М: "Математики", АМ: "Англійської мови", ІН: "Інформатики", ІСТ: "Історії", КБ: "Клас безпеки", ОП: "Обслуговуючої праці", ТП: "Технічної праці", СЗ: "Спортивний зал", АЗ: "Актовий зал", Б: "Біології", "ТП/Б": "Технічної праці / біології" };
export type Lesson = { subject: string; room: string; group?: string; teacherId?: string; note?: string };
export type Teacher = { id: string; name: string; rules: { subjects: string[]; classes: string[] }[] };
export type School = { version: 1; weekly: Record<string, (Lesson | null)[][]>; changes: Record<string, Record<string, (Lesson | null)[]>>; teachers: Teacher[]; calendar?:SchoolCalendar; weeklyVersions?:{effectiveFrom:string;label:string;weekly:School["weekly"]}[] };
export const bells = {
 junior: [["08:20","08:55"],["09:15","09:50"],["10:20","10:55"],["11:10","11:45"],["12:00","12:35"]],
 primary: [["08:20","09:00"],["09:15","09:55"],["10:25","11:05"],["11:20","12:00"],["12:15","12:55"],["13:10","13:50"]],
 senior: [["08:20","09:05"],["09:15","10:00"],["10:20","11:05"],["11:25","12:10"],["12:20","13:05"],["13:15","14:00"],["14:10","14:55"],["15:05","15:50"]],
};
export const classBells = (c: string) => c === "1" ? bells.junior : Number(c) <= 4 ? bells.primary : bells.senior;
export const meal = (c: string) => c === "1" ? ["09:50", "10:20"] : Number(c) <= 4 ? ["09:55", "10:25"] : c === "5" ? ["10:00", "10:20"] : ["11:05", "11:25"];
// Source abbreviations denote rooms, not teacher initials.
function row(line: string): (Lesson | null)[] {
 const result = line.split("|").map(part => { if (!part || part === "-") return null; const [subject, room = "", group] = part.split("~"); return { subject, room, ...(group ? { group } : {}) }; });
 while (result.length < 8) result.push(null); return result;
}
const source: Record<string, string[]> = {
 "5": [
 "Інформатика~ІН~I|Українська мова~УМ|Математика~М|Фізична культура~СЗ|Англійська мова~АМ|Робототехніка~М|STEM~ІСТ",
 "Зарубіжна література~КБ|Пізнаємо природу~ІСТ|Українська мова~УМ|Математика~М|Здоров’я, безпека та добробут~Б|Українська література~УМ",
 "Інформатика~ІН~II|Англійська мова~АМ|Українська мова~УМ|Математика~АМ|Математика~АМ|Технології~Б|Технології~Б",
 "Пізнаємо природу~ІСТ|Англійська мова~АМ|Фізична культура~СЗ|Історія~Г|Мистецтво~ІСТ|STEM~М|Виховна година~М",
 "Зарубіжна література~КБ|Українська мова~УМ|Математика~М|Етика~ІСТ|Фізична культура~СЗ|Англійська мова~АМ"],
 "6": [
 "Англійська мова~АМ|Математика~М|Українська мова~УМ|Українська мова~УМ|Географія~Г|Фізична культура~СЗ|Робототехніка~М",
 "Українська література~УМ|Зарубіжна література~КБ|Пізнаємо природу~ІСТ|Історія~Г|Українська мова~УМ|Здоров’я, безпека та добробут~Б|STEM~ІСТ|Виховна година~УМ",
 "Англійська мова~АМ|Математика~М|Математика~М|Українська мова~УМ|Громадянська освіта~Г|Фізична культура~СЗ|Інформатика~ІН~I",
 "Фізична культура~СЗ|Українська література~УМ|Математика~М|Математика~М|Географія~Г|Англійська мова~АМ|Етика~АМ",
 "Пізнаємо природу~ІСТ|Зарубіжна література~КБ|Технології~ТП|Технології~ТП|Історія~Г|Мистецтво~ІСТ|Інформатика~ІН~II"],
 "7": [
 "Українська мова~УМ|Алгебра~АМ|Хімія~Г|Фізика~КБ|Фізична культура~СЗ|Географія~Г|Англійська мова~АМ|Робототехніка~М",
 "Інформатика~ІН~I|Історія України~Г|Зарубіжна література~КБ|Українська література~УМ|Англійська мова~АМ|Геометрія~М|Інформатика~ІН~II",
 "Англійська мова~ІСТ|Алгебра~ІСТ|Фізика~КБ|Фізична культура~СЗ|Біологія~Б|Всесвітня історія~Г|Мистецтво~ІСТ|Виховна година~ІН",
 "Англійська мова~АМ|Фізична культура~СЗ|Українська мова~УМ|Українська мова~УМ|Біологія~Б|Географія~Г|Здоров’я, безпека та добробут~Б",
 "Технології~ТП/Б|Алгебра~М|Зарубіжна література~КБ|Українська література~УМ|Геометрія~М|Історія України~Г|STEM~АМ"],
 "8": [
 "Географія~Г|Фізична культура~СЗ|Фізика~КБ|Алгебра~М|Геометрія~М|Мистецтво~ІСТ|Інформатика~ІН~I|Інформатика~ІН~I",
 "Історія України~Г|Англійська мова~АМ|Хімія~Г|Зарубіжна література~КБ|Всесвітня історія~Г|Підприємництво і фінансова грамотність~ІСТ|Українська література~УМ",
 "Географія~Г|Українська мова~УМ|Англійська мова~АМ|Алгебра~М|Фізична культура~СЗ|Фізика~КБ|Інформатика~М~II|Інформатика~ІН~II",
 "Геометрія~М|Алгебра~М|Англійська мова~АМ|Біологія~Б|Фізична культура~СЗ|Українська мова~УМ|Професії~ІСТ|Виховна година~ІСТ",
 "Українська мова~УМ|Історія України~Г|Хімія~Г|Зарубіжна література~КБ|Біологія~Б|Здоров’я, безпека та добробут~Б|Технології~Б|STEM~АМ"],
 "9-А": [
 "Фізика~КБ|Історія України~Г|Інформатика~ІН|Алгебра~ІН|Англійська мова~ІСТ|Фізика~КБ|Фізична культура~СЗ|STEM~АМ",
 "Мистецтво~ІСТ|Українська мова~УМ|Геометрія~ІН|Англійська мова~АМ|Зарубіжна література~КБ|Хімія~Г|Біологія~Б|Виховна година~КБ",
 "Українська мова~УМ|Фізика~КБ|Географія~Г|Здоров’я, безпека та добробут~Б|Інформатика~ІН|Алгебра~ІН|Фізична культура~СЗ|STEM~ІСТ",
 "Всесвітня історія~Г|Підприємництво і фінансова грамотність~ІСТ|Хімія~Г|Фізична культура~СЗ|Англійська мова~АМ|Біологія~Б",
 "Громадянська освіта~Г|Технології~ТП/Б|Українська мова~УМ|Алгебра~М|Українська література~УМ|Геометрія~М|Професії~ІСТ"],
 "9-Б": [
 "Алгебра~М|Фізика~КБ|Фізична культура~СЗ|Хімія~Г|Українська мова~УМ|Англійська мова~АМ|Історія України~Г|Професії~ІСТ",
 "Інформатика~М~I|Алгебра~М|Англійська мова~АМ|Підприємництво і фінансова грамотність~ІСТ|Геометрія~ІН|Зарубіжна література~КБ|Інформатика~М~I|STEM~М",
 "Алгебра~М|Географія~Г|Фізична культура~СЗ|Фізика~КБ|Фізика~КБ|Мистецтво~ІСТ|Громадянська освіта~Г|Виховна година~ТП",
 "Українська мова~УМ|Хімія~Г|Біологія~Б|Англійська мова~АМ|Українська література~УМ|Фізична культура~СЗ|Інформатика~ІН~II|Інформатика~ІН~II",
 "Геометрія~М|Технології~ТП/Б|Біологія~Б|Всесвітня історія~Г|Зарубіжна література~КБ|Українська мова~УМ|Правознавство~Г"],
};
export const seed: School = {
 version: 1,
 calendar:defaultCalendar,
 weekly: Object.fromEntries(classes.map(c => [c, source[c] ? source[c].map(row) : Array.from({length:5},()=>Array(8).fill(null))])),
 teachers: [
  { id: "burova", name: "Бурова Діана Олександрівна", rules: [{ subjects: ["Англійська мова"], classes: ["7", "8", "9-А", "9-Б"] }] },
  { id: "abrosimov", name: "Абросімов Євгеній Олександрович", rules: [{ subjects: ["Фізика"], classes: ["5", "6", "7", "8", "9-А", "9-Б"] }, {subjects:["Інформатика"],classes:["8"]}] },
  { id: "dmytriieva", name: "Дмитрієва Марина Вікторівна", rules: [
   { subjects: ["Інформатика"], classes: ["5", "9-А"] },
   { subjects: ["Робототехніка"], classes: ["5", "6", "7"] },
   { subjects: ["Математика"], classes: ["6"] },
   { subjects: ["Алгебра", "Геометрія"], classes: ["8"] },
  ] },
 ],
 changes: { "2026-10-06": {
 "5": row("Зарубіжна література~КБ|Пізнаємо природу~УМ|Українська мова~УМ|Математика~М|Українська література~УМ|Здоров’я, безпека та добробут~Б"),
 "6": row("Українська література~УМ|Зарубіжна література~КБ|Пізнаємо природу~ІСТ|Історія~Г|Здоров’я, безпека та добробут~Б|STEM~ІСТ|Українська мова~УМ|Виховна година~УМ"),
 "7": row("Інформатика~ІН~I|Історія України~Г|Зарубіжна література~КБ|Українська література~УМ|Геометрія~М|Інформатика~ІН~II"),
 "8": row("Історія України~Г|Підприємництво і фінансова грамотність~ІСТ|Хімія~Г|Зарубіжна література~КБ|Всесвітня історія~Г|Українська література~УМ"),
 "9-А": row("Мистецтво~ІСТ|Українська мова~УМ|Геометрія~ІН|Біологія~Б|Зарубіжна література~КБ|Хімія~Г|Виховна година~КБ"),
 "9-Б": row("-|Алгебра~М|STEM~М|Підприємництво і фінансова грамотність~ІСТ|Інформатика~ІН~Усі|Зарубіжна література~КБ|Геометрія~ІН"),
 } },
};
export function kyivNow(date = new Date()) {
 const parts = new Intl.DateTimeFormat("en-CA", { timeZone:"Europe/Kyiv", year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23" }).formatToParts(date);
 const p = Object.fromEntries(parts.map(x=>[x.type,x.value]));
 return { date: `${p.year}-${p.month}-${p.day}`, time:`${p.hour}:${p.minute}`, seconds:Number(p.second), minutes:Number(p.hour)*60+Number(p.minute) };
}
export function weekday(date: string) { return new Date(`${date}T12:00:00Z`).getUTCDay() - 1; }
// Editors need the stored day even when the calendar hides it from public views.
export function editableDayLessons(s:School,c:string,date:string):(Lesson|null)[]{const d=weekday(date);return s.changes[date]?.[c]??(d>=0&&d<=4?weeklyForDate(s,date)[c][d]:Array(8).fill(null));}
export function dayLessons(s: School, c: string, date: string): (Lesson|null)[] { const d=weekday(date); return d < 0 || d > 4 || nonTeachingReason(getCalendar(s),c,date) ? Array(8).fill(null) : editableDayLessons(s,c,date); }
export function lessonTeacher(s: School, lesson: Lesson, c: string): Teacher | undefined {
 if (lesson.teacherId) return s.teachers.find(t => t.id === lesson.teacherId);
 return s.teachers.find(t => t.rules.some(r => r.subjects.includes(lesson.subject) && r.classes.includes(c)));
}
export function isChanged(s: School, c:string, date:string, slot:number) {
 const d=weekday(date); return d>=0 && d<=4 && !!s.changes[date]?.[c] && JSON.stringify(s.changes[date][c][slot])!==JSON.stringify(weeklyForDate(s,date)[c][d][slot]);
}
export const minutes = (time:string) => Number(time.slice(0,2))*60+Number(time.slice(3));
export type ScheduledLesson = { date:string; c:string; slot:number; lesson:Lesson; time:string[] };
export type ScheduleTarget = ({ classId:string } | { teacherId:string }) & {group?:string};
export function lessonsForTarget(s:School,date:string,target:ScheduleTarget):ScheduledLesson[] {
 const selectedClasses="classId" in target?[target.classId]:classes;
 return selectedClasses.flatMap(c=>dayLessons(s,c,date).flatMap((lesson,slot)=>lesson && matchesGroup(lesson,target.group) && ("classId" in target || lessonTeacher(s,lesson,c)?.id===target.teacherId)?[{date,c,slot,lesson,time:classBells(c)[slot]}]:[])).sort((a,b)=>minutes(a.time[0])-minutes(b.time[0])||a.c.localeCompare(b.c));
}
export function schoolYearStart(date:string) { const year=Number(date.slice(0,4))-(Number(date.slice(5,7))<9?1:0); return `${year}-09-01`; }
export function lessonStatistics(s:School,now:ReturnType<typeof kyivNow>,target:ScheduleTarget) {
 const start=getCalendar(s).start, subjects:Record<string,number>={}; let completed=0;
 const cursor=new Date(start+"T12:00:00Z");
 while(cursor.toISOString().slice(0,10)<=now.date && cursor.toISOString().slice(0,10)<=getCalendar(s).end){const date=cursor.toISOString().slice(0,10);for(const row of lessonsForTarget(s,date,target)){if(date<now.date || minutes(row.time[1])<=now.minutes){completed++;const subject=row.lesson.subject+(row.lesson.group?` · ${row.lesson.group==="Усі"?"Усі групи":`Група ${row.lesson.group}`}`:"");subjects[subject]=(subjects[subject]||0)+1;}}cursor.setUTCDate(cursor.getUTCDate()+1);}
 const today=lessonsForTarget(s,now.date,target),completedToday=today.filter(row=>minutes(row.time[1])<=now.minutes).length;
 const active=today.filter(row=>now.minutes>=minutes(row.time[0])&&now.minutes<minutes(row.time[1]));
 return {start,completed,subjects,completedToday,totalToday:today.length,remainingToday:today.length-completedToday,active};
}
export function nextScheduledLesson(s:School,now:ReturnType<typeof kyivNow>,target:ScheduleTarget):ScheduledLesson|null {
 const cursor=new Date(now.date+"T12:00:00Z");
 for(let i=0;i<370 && cursor.toISOString().slice(0,10)<=getCalendar(s).end;i++){const date=cursor.toISOString().slice(0,10);const next=lessonsForTarget(s,date,target).find(row=>date>now.date || minutes(row.time[0])>now.minutes);if(next)return next;cursor.setUTCDate(cursor.getUTCDate()+1);}return null;
}
export function countdownTo(time:string,now:ReturnType<typeof kyivNow>) { const seconds=Math.max(0,minutes(time)*60-now.minutes*60-now.seconds);return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`; }
export function currentStatus(s: School,c:string,date:string,time:string,group?:string) {
 const lessons=dayLessons(s,c,date).map(l=>matchesGroup(l,group)?l:null); const b=classBells(c); const now=minutes(time); const food=meal(c);
 const current=b.findIndex(([a,z])=>now>=minutes(a)&&now<minutes(z));
 const next=b.findIndex(([a],i)=>now<minutes(a)&&lessons[i]);
 const nextText=next<0?null:{slot:next,lesson:lessons[next] as Lesson,time:b[next][0]};
 const noSchool=nonTeachingReason(getCalendar(s),c,date); if(noSchool) return {title:noSchool,kind:"off",slot:-1,next:null};
 if(!lessons.some(Boolean)) return {title:s.changes[date]?.[c]?"На цю дату уроків немає":"Предмети ще не додані",kind:s.changes[date]?.[c]?"off":"empty",slot:-1,next:null};
 if(current>=0 && lessons[current]) return {title:lessons[current]!.subject,kind:"lesson",slot:current,next:nextText};
 if(now>=minutes(food[0])&&now<minutes(food[1])) return {title:"Час харчування",kind:"meal",slot:-1,next:nextText};
 return {title:next<0?"Уроки завершено":now<minutes(b[0][0])?"До початку уроків":"Перерва / вільний час",kind:next<0?"off":"break",slot:-1,next:nextText};
}

export function lessonNumberKey(c:string,date:string,slot:number){return date+"|"+c+"|"+slot;}
export function buildLessonNumberIndex(s:School):Record<string,number>{
 const result:Record<string,number>={};
 for(const semester of getCalendar(s).semesters){const counters:Record<string,number>={};const cursor=new Date(semester.start+"T12:00:00Z");while(cursor.toISOString().slice(0,10)<=semester.end){const date=cursor.toISOString().slice(0,10);for(const c of classes){dayLessons(s,c,date).forEach((l,slot)=>{if(!l)return;const key=JSON.stringify([c,l.subject,l.group||""]);const number=(counters[key]||0)+1;counters[key]=number;result[lessonNumberKey(c,date,slot)]=number;});}cursor.setUTCDate(cursor.getUTCDate()+1);}}return result;
}

export function matchesGroup(l:Lesson|null|undefined,group?:string){return !l||!group||!l.group||l.group==='Усі'||l.group===group;}
export function weeklyForDate(s:School,date:string):School['weekly']{return [...(s.weeklyVersions||[])].filter(v=>v.effectiveFrom<=date).sort((a,b)=>b.effectiveFrom.localeCompare(a.effectiveFrom))[0]?.weekly??s.weekly;}
export function ensureWeeklyVersion(s:School,date:string){
 if(!s.weeklyVersions?.length)s.weeklyVersions=[{effectiveFrom:getCalendar(s).start,label:'Початковий розклад',weekly:structuredClone(s.weekly)}];
 let version=s.weeklyVersions.find(v=>v.effectiveFrom===date);
 if(!version){version={effectiveFrom:date,label:'Розклад від '+date,weekly:structuredClone(weeklyForDate(s,date))};s.weeklyVersions.push(version);s.weeklyVersions.sort((a,b)=>a.effectiveFrom.localeCompare(b.effectiveFrom));}
 return version;
}
export function describeLesson(l:Lesson|null){return l?l.subject+(l.group?' · '+(l.group==='Усі'?'Усі групи':'Група '+l.group):'')+(l.room?' · каб. '+l.room:''):'Немає уроку';}
export function lessonChange(s:School,c:string,date:string,slot:number){if(!isChanged(s,c,date,slot))return null;return {before:weeklyForDate(s,date)[c][weekday(date)][slot],after:s.changes[date][c][slot]};}
