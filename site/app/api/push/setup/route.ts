import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {isScheduleEditor} from '../../../../lib/schedule-access';
import type {PushEnv} from '../../../../lib/push-store';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!isScheduleEditor(await getChatGPTUser()))return Response.json({error:'Лише власник може налаштувати таймер.'},{status:403,headers:{'Cache-Control':'no-store'}});
 const e=env as PushEnv;if(!e.PUSH_RUNNER_KEY)return Response.json({error:'Ключ таймера ще не налаштовано.'},{status:503});
 return Response.json({url:new URL('/api/push/run',request.url).href,method:'POST',interval:'Кожну хвилину',headerName:'X-Push-Runner',headerValue:e.PUSH_RUNNER_KEY},{headers:{'Cache-Control':'private, no-store','Pragma':'no-cache'}});
}
