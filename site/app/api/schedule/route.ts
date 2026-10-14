import { isScheduleEditor } from "../../../lib/schedule-access";
import { scheduleDb } from "../../../db/school";
import { seed } from "../../../lib/school";
import { schoolSchema } from "../../../lib/validation";
import { getChatGPTUser } from "../../chatgpt-auth";
import {historyStatements} from '../../../lib/schedule-history';
import {changeJobStatements} from '../../../lib/push-store';
export const dynamic = "force-dynamic";
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function GET() {
 try {
  const row=await scheduleDb().prepare("SELECT data, revision, updated_at FROM schedules WHERE id = ?").bind("school").first<{data:string;revision:number;updated_at:string}>();
  return reply(row?{school:JSON.parse(row.data),revision:row.revision,updatedAt:row.updated_at}:{school:seed,revision:0,updatedAt:null});
 }catch(e){console.error("Schedule load failed",e);return reply({error:"Не вдалося завантажити розклад. Спробуйте ще раз."},503);}
}
export async function PUT(request:Request) {
 const user=await getChatGPTUser();
 if(!user)return reply({error:"Увійдіть, щоб зберегти розклад."},401);
 if(!isScheduleEditor(user))return reply({error:"Лише власник може змінювати розклад."},403);
 if(request.headers.get("origin") && request.headers.get("origin")!==new URL(request.url).origin)return reply({error:"Недозволений запит"},403);
 try {
  const text=await request.text(); if(text.length>750000)return reply({error:"Файл завеликий"},413);
  const body=JSON.parse(text); const parsed=schoolSchema.safeParse(body.school);
  if(!parsed.success || !Number.isSafeInteger(body.revision) || body.revision<0)return reply({error:parsed.success?"Некоректна версія":parsed.error.issues[0].message},400);
  const data=JSON.stringify(parsed.data), updatedAt=new Date().toISOString(), revision=body.revision+1;
  const db=scheduleDb();
  const previous=await db.prepare('SELECT data FROM schedules WHERE id = ? AND revision = ?').bind('school',body.revision).first<{data:string}>();
  const jobs=await changeJobStatements(db,previous?JSON.parse(previous.data):seed,parsed.data,revision,data);
  const results=await db.batch([...historyStatements(data,body.revision,updatedAt,JSON.stringify(seed)).map(({sql,args})=>db.prepare(sql).bind(...args)),...jobs]);
  const result=results[body.revision===0?2:1];
  if(result.meta.changes===0)return reply({error:"Розклад уже змінили в іншому вікні. Збережіть резервну копію чернетки й оновіть сторінку."},409);
  return reply({school:parsed.data,revision,updatedAt});
 }catch(e){if(e instanceof SyntaxError)return reply({error:"Некоректний JSON"},400);console.error("Schedule save failed",e);return reply({error:"Не вдалося зберегти. Чернетка залишається у формі."},503);}
}
