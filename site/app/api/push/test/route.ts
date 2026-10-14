import {env} from 'cloudflare:workers';
import {scheduleDb} from '../../../../db/school';
import {hash,sendPush,pushErrorInfo} from '../../../../lib/web-push';
import {pushConfig,type PushEnv} from '../../../../lib/push-store';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Недозволений запит'},{status:403});
 try{const text=await request.text();if(text.length>1024)return Response.json({error:'Запит завеликий'},{status:413});const {id,token}=JSON.parse(text);if(typeof id!=='string'||typeof token!=='string'||id.length!==43||token.length!==43)return Response.json({error:'Некоректна підписка'},{status:400});const db=scheduleDb(),tokenHash=await hash(token),row=await db.prepare('SELECT subscription FROM push_subscriptions WHERE id = ? AND token_hash = ?').bind(id,tokenHash).first<{subscription:string}>();if(!row)return Response.json({error:'Спочатку ввімкніть сповіщення.'},{status:404});
  const now=Date.now(),claim=await db.prepare('UPDATE push_subscriptions SET last_test = ? WHERE id = ? AND token_hash = ? AND last_test < ?').bind(now,id,tokenHash,now-60000).run();if(!claim.meta.changes)return Response.json({error:'Повторний тест доступний через хвилину.'},{status:429});
  const status=await sendPush(JSON.parse(row.subscription),{title:'Сповіщення працюють',body:'Матроська гімназія · Ви отримуватимете вибрані повідомлення про розклад.',tag:'test',url:'/'},pushConfig(env as PushEnv));
  if(status===404||status===410){await db.prepare('DELETE FROM push_subscriptions WHERE id = ?').bind(id).run();return Response.json({error:'Підписка застаріла. Вимкніть і ввімкніть сповіщення повторно.'},{status:410});}
  return status>=200&&status<300?Response.json({ok:true}):Response.json({error:'Сервіс сповіщень не прийняв повідомлення. Спробуйте пізніше.'},{status:502});
 }catch(error){console.error('Push test failed',pushErrorInfo(error));return Response.json({error:'Не вдалося надіслати тест. Спробуйте пізніше.'},{status:503});}
}
