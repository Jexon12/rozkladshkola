import {env} from 'cloudflare:workers';
import {runPushJobs,pushConfig,type PushEnv} from '../../../../lib/push-store';
import {diagnosePush} from '../../../../lib/web-push';
export const dynamic='force-dynamic';
export async function POST(request:Request){const e=env as PushEnv;if(!e.PUSH_RUNNER_KEY||request.headers.get('X-Push-Runner')!==e.PUSH_RUNNER_KEY)return Response.json({error:'Unauthorized'},{status:401});try{if(request.headers.get('X-Push-Diagnostic')==='true')return Response.json(await diagnosePush(pushConfig(e)),{headers:{'Cache-Control':'no-store'}});return Response.json(await runPushJobs(e),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Notification runner unavailable'},{status:503});}}
