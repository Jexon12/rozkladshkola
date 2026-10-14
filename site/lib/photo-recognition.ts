import type { Lesson } from './school';
export type PhotoEntry={classId:string;slot:number;lesson:Lesson|null};
export function parsePhotoDate(raw:string):string|null {
 const months=['січ','лют','бер','квіт','трав','черв','лип','серп','верес','жовт','лист','груд'];
 const text=raw.toLocaleLowerCase('uk').replace(/[_\n]/g,' ');
 const written=text.match(/(?:^|\D)(\d{1,2})\s+([а-яіїєґ]+)\s+(20\d{2})(?:\D|$)/),numeric=text.match(/(?:^|\D)(\d{1,2})[./-](\d{1,2})[./-](20\d{2})(?:\D|$)/);
 const day=written?.[1]||numeric?.[1],year=written?.[3]||numeric?.[3],month=written?months.findIndex(m=>written[2].startsWith(m))+1:Number(numeric?.[2]);if(!day||!year||month<1||month>12)return null;
 const date=`${year}-${String(month).padStart(2,'0')}-${day.padStart(2,'0')}`;return !Number.isNaN(Date.parse(date))&&new Date(date+'T12:00:00Z').toISOString().slice(0,10)===date?date:null;
}
const aliases:[RegExp,string][]=[
 [/^навч.*грам/,'Навчання грамоти'],[/^[яаa]дос/,'Я досліджую світ'],[/^(лі[тгд].*чит|чит)/,'Літературне читання'],[/^диз/,'Дизайн і технології'],[/^хоре/,'Хореографія'],
 [/^психол/,'Психологічна година'], [/^бюл/,'Біологія'],
 [/^інформ/,'Інформатика'],[/^укр.*мов/,'Українська мова'],[/^укр.*літ/,'Українська література'],[/^зар/,'Зарубіжна література'],[/^піз/,'Пізнаємо природу'],[/^анг/,'Англійська мова'],[/^(фіз.*кул|фізк)/,'Фізична культура'],[/^фіз/,'Фізика'],[/^мат/,'Математика'],[/^алг/,'Алгебра'],[/^геометр/,'Геометрія'],[/^географ/,'Географія'],[/^хім/,'Хімія'],[/^біол/,'Біологія'],[/^мист/,'Мистецтво'],[/^всес/,'Всесвітня історія'],[/^іст.*укр/,'Історія України'],[/^іст/,'Історія'],[/^зд[оа]р/,'Здоров’я, безпека та добробут'],[/^під/,'Підприємництво і фінансова грамотність'],[/^вих/,'Виховна година'],[/^(stem|стем|sтем)/i,'STEM'],[/^техн/,'Технології'],[/^робот/,'Робототехніка'],[/^гром/,'Громадянська освіта'],[/^етик/,'Етика'],[/^проф/,'Професії'],[/^прав/,'Правознавство']
];
export function parsePhotoCell(raw:string):{lesson:Lesson|null;known:boolean}{
 let text=raw.replace(/[\r\n]+/g,' ').replace(/\s+/g,' ').trim().replace(/^[|\[\]{}(«!™"“”]+|[|\[\]{}]+$/g,'').trim();
 if(!text||/^[-_—\s.]+$/.test(text))return {lesson:null,known:false};
 const note=/\(\s*заміна\s*\)/i.test(text)?'Заміна':'';text=text.replace(/\(\s*заміна\s*\)/ig,'').trim();
 const g=text.match(/\(\s*((?:[IІіil1їЇTТ][IІіil1їЇTТ!]?|2))\s*\)/);let group='';if(g){group=g[1].length===2||g[1]==='2'?'II':'I';text=text.replace(g[0],'').trim();}else if(/(?:^|\s)(?:[вb][сc][іiї]|усі)(?:\s|$)/i.test(text)){group='Усі';text=text.replace(/(?:[вb][сc][іiї]|усі)/ig,'').trim();}
 text=text.replace(/^(STEM)([МM])$/i,'STEM $2');
 const match=text.match(/(?:^|\s)([ТT][ПP]\s*\/\s*[БB]|[ІIЇ][СCT][ТT]|[ІIЇ][НH]|[КK][БB]|[УY][МM]|[АA][МM]|[СC][З3]|[ТT][ПPІI]|[ОO][ПP]|[АA][З3]|[БB]|[ГrR]|[МM])\s*[.,:;|_—\-]*$/i);
 const room=(match?.[1]||'').toUpperCase().replace(/\s/g,'').replace(/[IЇ]/g,'І').replace(/C/g,'С').replace(/T/g,'Т').replace(/H/g,'Н').replace(/K/g,'К').replace(/B/g,'Б').replace(/Y/g,'У').replace(/M/g,'М').replace(/A/g,'А').replace(/P/g,'П').replace(/O/g,'О').replace(/3/g,'З').replace(/R/g,'Г').replace(/^ТІ$/,'ТП');
 if(match)text=text.slice(0,match.index).trim();
 const key=text.toLocaleLowerCase('uk').replace(/[^а-яєіїґa-z0-9]/gi,'').replace(/[iї]/g,'і').replace(/^bux/,'вих').replace(/^ффіз/,'фіз');const subject=aliases.find(([re])=>re.test(key))?.[1]||closestSubject(key);
 return {lesson:{subject:subject||text,room,...(group?{group}:{}),...(note?{note}:{})},known:!!subject};
}

function distance(a:string,b:string){const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prev=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old;}}return row[b.length];}
function closestSubject(key:string):string|undefined {
 if(key.length<5)return;
 const variants=[...new Set(aliases.map(([,subject])=>subject))].map(subject=>({subject,key:subject.toLocaleLowerCase('uk').replace(/[^а-яєіїґa-z0-9]/gi,'').replace(/ї/g,'і')}));
 const ranked=variants.map(v=>({...v,score:1-distance(key,v.key)/Math.max(key.length,v.key.length)})).sort((a,b)=>b.score-a.score);
 // Correct small character errors only; retain unclear text for review.
 if(ranked[0].score>=.8&&ranked[0].score-ranked[1].score>=.12)return ranked[0].subject;
}
