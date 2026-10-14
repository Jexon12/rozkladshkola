import {seed,type School} from './school';
import {scheduledPushes,scheduleChangePush,type PushPreferences,type PlannedPush} from './push-plan';
import {hash,sendPush,pushErrorInfo,type BrowserSubscription} from './web-push';
export type PushEnv={DB?:D1Database;PUSH_VAPID_PUBLIC_KEY?:string;PUSH_VAPID_PRIVATE_JWK?:string;PUSH_VAPID_SUBJECT?:string;PUSH_RUNNER_KEY?:string;PUSH_TIMER_ENABLED?:string};
export type StoredSubscription={id:string;subscription:string;preferences:string;created_at:number};
export function pushConfig(env:PushEnv){if(!env.PUSH_VAPID_PUBLIC_KEY||!env.PUSH_VAPID_PRIVATE_JWK)throw new Error('Сповіщення ще налаштовуються. Спробуйте пізніше.');return{publicKey:env.PUSH_VAPID_PUBLIC_KEY,privateJwk:env.PUSH_VAPID_PRIVATE_JWK,subject:env.PUSH_VAPID_SUBJECT||'mailto:abrosimov_j@ukr.net'};}
export async function loadSubscriptions(db:D1Database){return(await db.prepare('SELECT id,subscription,preferences,created_at FROM push_subscriptions').all<StoredSubscription>()).results;}
export async function jobStatement(db:D1Database,sub:string,job:PlannedPush,guard?:{revision:number;data:string}){
 const id=await hash(sub+':'+job.key);
 const sql=guard?'INSERT OR IGNORE INTO push_jobs (id,subscription_id,payload,due_at,expires_at) SELECT ?,?,?,?,? FROM schedules WHERE id = ? AND revision = ? AND data = ?':'INSERT OR IGNORE INTO push_jobs (id,subscription_id,payload,due_at,expires_at) VALUES (?,?,?,?,?)';
 return db.prepare(sql).bind(id,sub,JSON.stringify(job.payload),job.dueAt,job.expiresAt,...(guard?['school',guard.revision,guard.data]:[]));
}
export async function changeJobStatements(db:D1Database,before:School,after:School,revision:number,data:string){
 const statements:D1PreparedStatement[]=[];for(const sub of await loadSubscriptions(db)){const job=scheduleChangePush(before,after,JSON.parse(sub.preferences),revision);if(job)statements.push(await jobStatement(db,sub.id,job,{revision,data}));}return statements;
}
export async function runPushJobs(env:PushEnv,at=new Date()){
 const db=env.DB;if(!db)throw new Error('Missing push storage');const config=pushConfig(env),stamp=at.getTime();
 const row=await db.prepare('SELECT data FROM schedules WHERE id = ?').bind('school').first<{data:string}>(),school:School=row?JSON.parse(row.data):seed;
 const subscriptions=await loadSubscriptions(db),statements:D1PreparedStatement[]=[];
 for(const sub of subscriptions){const prefs:PushPreferences=JSON.parse(sub.preferences);for(const job of scheduledPushes(school,prefs,at))statements.push(await jobStatement(db,sub.id,job));}
 for(let i=0;i<statements.length;i+=50)await db.batch(statements.slice(i,i+50));
 const jobs=(await db.prepare('SELECT id,subscription_id,payload,expires_at FROM push_jobs WHERE sent_at IS NULL AND due_at <= ? AND expires_at > ? AND lease_until <= ? AND attempts < 5 ORDER BY due_at LIMIT 50').bind(stamp,stamp,stamp).all<{id:string;subscription_id:string;payload:string;expires_at:number}>()).results;
 let sent=0,failed=0,expired=0;
 for(let i=0;i<jobs.length;i+=25)await Promise.all(jobs.slice(i,i+25).map(async job=>{
  const claim=await db.prepare('UPDATE push_jobs SET lease_until = ?, attempts = attempts + 1 WHERE id = ? AND sent_at IS NULL AND lease_until <= ? AND attempts < 5').bind(stamp+120000,job.id,stamp).run();if(!claim.meta.changes)return;
  const sub=subscriptions.find(s=>s.id===job.subscription_id);if(!sub){await db.prepare('DELETE FROM push_jobs WHERE id = ?').bind(job.id).run();return;}
  // Recheck current preferences and lesson contents before sending a queued reminder.
  const payload=JSON.parse(job.payload),prefs:PushPreferences=JSON.parse(sub.preferences);
  const enabled=payload.tag.startsWith('lesson-')?prefs.reminders:payload.tag.startsWith('tomorrow-')?prefs.tomorrow:prefs.changes;
  if(!enabled){await db.prepare('DELETE FROM push_jobs WHERE id = ?').bind(job.id).run();return;}
  if(payload.tag.startsWith('lesson-')||payload.tag.startsWith('tomorrow-')){const fresh=scheduledPushes(school,prefs,at).find(j=>j.payload.tag===payload.tag);if(!fresh){await db.prepare('DELETE FROM push_jobs WHERE id = ?').bind(job.id).run();return;}Object.assign(payload,fresh.payload);}
  try{const status=await sendPush(JSON.parse(sub.subscription),payload,config,(job.expires_at-stamp)/1000);
   if(status===404||status===410){await db.batch([db.prepare('DELETE FROM push_subscriptions WHERE id = ?').bind(sub.id),db.prepare('DELETE FROM push_jobs WHERE subscription_id = ?').bind(sub.id)]);expired++;}
   else if(status>=200&&status<300){await db.prepare('UPDATE push_jobs SET sent_at = ? WHERE id = ?').bind(stamp,job.id).run();sent++;}
   else {failed++;if(status>=400&&status<500&&status!==429)await db.prepare('UPDATE push_jobs SET attempts = 5 WHERE id = ?').bind(job.id).run();}
  }catch(error){console.error('Queued push delivery failed',pushErrorInfo(error));failed++;}
 }));
 await db.prepare('DELETE FROM push_jobs WHERE expires_at < ?').bind(stamp-7*24*60*60*1000).run();
 return {subscriptions:subscriptions.length,sent,failed,expired,pending:jobs.length-sent-expired};
}
