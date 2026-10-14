import {z} from 'zod';
import {scheduleDb} from '../../../../db/school';
import {seed,type School} from '../../../../lib/school';
import {pushPreferencesSchema} from '../../../../lib/push-plan';
import {allowedPushEndpoint,bytes64,hash} from '../../../../lib/web-push';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const schema=z.object({token:z.string().regex(/^[a-zA-Z0-9_-]{43}$/),subscription:z.object({endpoint:z.string().max(2048).refine(allowedPushEndpoint),expirationTime:z.number().nullable().optional(),keys:z.object({p256dh:z.string().regex(/^[a-zA-Z0-9_-]+$/).refine(v=>bytes64(v).length===65),auth:z.string().regex(/^[a-zA-Z0-9_-]+$/).refine(v=>bytes64(v).length===16)}).strict()}).strict(),preferences:pushPreferencesSchema}).strict();
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Недозволений запит'},403);
 try{const text=await request.text();if(text.length>12000)return reply({error:'Запит завеликий'},413);const parsed=schema.safeParse(JSON.parse(text));if(!parsed.success)return reply({error:'Перевірте налаштування сповіщень.'},400);
  const {token,subscription,preferences}=parsed.data,db=scheduleDb(),id=await hash(subscription.endpoint),tokenHash=await hash(token);
  await crypto.subtle.importKey('raw',bytes64(subscription.keys.p256dh),{name:'ECDH',namedCurve:'P-256'},false,[]);
  const row=await db.prepare('SELECT data FROM schedules WHERE id = ?').bind('school').first<{data:string}>(),school:School=row?JSON.parse(row.data):seed;
  const target=preferences.target;if('teacherId'in target&&!school.teachers.some(t=>t.id===target.teacherId))return reply({error:'Оберіть учителя зі списку.'},400);
  const result=await db.prepare('INSERT INTO push_subscriptions (id,token_hash,subscription,preferences,created_at) VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET subscription = excluded.subscription, preferences = excluded.preferences WHERE push_subscriptions.token_hash = excluded.token_hash').bind(id,tokenHash,JSON.stringify(subscription),JSON.stringify(preferences),Date.now()).run();
  if(!result.meta.changes)return reply({error:'Ця підписка належить іншій сесії. Вимкніть сповіщення в браузері та ввімкніть повторно.'},403);
  await db.prepare('DELETE FROM push_jobs WHERE subscription_id = ? AND sent_at IS NULL').bind(id).run();
  return reply({id,preferences});
 }catch(e){console.error('Push subscription failed',e instanceof Error?e.name:'error');return reply({error:'Не вдалося зберегти підписку. Спробуйте ще раз.'},503);}
}
export async function DELETE(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Недозволений запит'},403);
 try{const text=await request.text();if(text.length>1024)return reply({error:'Запит завеликий'},413);const parsed=z.object({id:z.string().regex(/^[a-zA-Z0-9_-]{43}$/),token:z.string().regex(/^[a-zA-Z0-9_-]{43}$/)}).strict().safeParse(JSON.parse(text));if(!parsed.success)return reply({error:'Некоректна підписка'},400);
  const db=scheduleDb(),{id,token}=parsed.data,tokenHash=await hash(token);await db.batch([db.prepare('DELETE FROM push_jobs WHERE subscription_id = ? AND EXISTS (SELECT 1 FROM push_subscriptions WHERE id = ? AND token_hash = ?)').bind(id,id,tokenHash),db.prepare('DELETE FROM push_subscriptions WHERE id = ? AND token_hash = ?').bind(id,tokenHash)]);return reply({ok:true});
 }catch{return reply({error:'Не вдалося вимкнути сповіщення. Спробуйте ще раз.'},503);}
}
export async function GET(request:Request){const id=new URL(request.url).searchParams.get('id'),token=request.headers.get('X-Push-Token');if(!id||!token||token.length!==43)return reply({error:'Немає підписки'},401);const row=await scheduleDb().prepare('SELECT preferences FROM push_subscriptions WHERE id = ? AND token_hash = ?').bind(id,await hash(token)).first<{preferences:string}>();return row?reply({preferences:JSON.parse(row.preferences)}):reply({error:'Підписку не знайдено'},404);}
