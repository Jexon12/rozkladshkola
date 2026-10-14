import {scheduleDb} from '../../../../db/school';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {isScheduleEditor} from '../../../../lib/schedule-access';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
 const user=await getChatGPTUser();if(!user)return reply({error:'Увійдіть для перегляду історії.'},401);if(!isScheduleEditor(user))return reply({error:'Історія доступна лише редактору.'},403);
 try{const revision=new URL(request.url).searchParams.get('revision'),db=scheduleDb();
  if(revision!==null){if(!/^\d+$/.test(revision)||!Number.isSafeInteger(Number(revision)))return reply({error:'Некоректна версія.'},400);const row=await db.prepare('SELECT data,revision,updated_at FROM schedule_history WHERE revision = ?').bind(Number(revision)).first<{data:string;revision:number;updated_at:string}>();return row?reply({school:JSON.parse(row.data),revision:row.revision,updatedAt:row.updated_at}):reply({error:'Версія недоступна.'},404);}
  const rows=await db.prepare('SELECT revision,updated_at FROM schedule_history ORDER BY revision DESC LIMIT 50').all();return reply({versions:rows.results});
 }catch(e){console.error('History load failed',e);return reply({error:'Не вдалося завантажити історію.'},503);}
}
