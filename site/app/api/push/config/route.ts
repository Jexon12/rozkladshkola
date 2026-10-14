import {env} from 'cloudflare:workers';
import type {PushEnv} from '../../../../lib/push-store';
export const dynamic='force-dynamic';
export async function GET(){const e=env as PushEnv;return Response.json({publicKey:e.PUSH_VAPID_PUBLIC_KEY||null,configured:!!(e.PUSH_VAPID_PUBLIC_KEY&&e.PUSH_VAPID_PRIVATE_JWK),timerReady:e.PUSH_TIMER_ENABLED==='true'}, {headers:{'Cache-Control':'no-store'}});}
