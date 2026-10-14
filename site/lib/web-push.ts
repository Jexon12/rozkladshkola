// RFC 8291 (aes128gcm) and RFC 8292 (VAPID), using Worker-native Web Crypto/fetch.
export type BrowserSubscription={endpoint:string;keys:{p256dh:string;auth:string}};
export type PushPayload={title:string;body:string;tag:string;url:string};
const encoder=new TextEncoder();
export class PushDeliveryError extends Error {constructor(public stage:string,cause:unknown){super(cause instanceof Error?cause.message:'Unknown push error');this.name=cause instanceof Error?cause.name:'PushDeliveryError';}}
export function pushErrorInfo(error:unknown){return {stage:error instanceof PushDeliveryError?error.stage:'request',name:error instanceof Error?error.name:'Error',detail:(error instanceof Error?error.message:'Unknown error').replace(/https?:\/\/\S+/g,'[url]').replace(/[A-Za-z0-9_\/-]{32,}/g,'[redacted]').slice(0,200)};}
export function bytes64(value:string):Uint8Array<ArrayBuffer>{const raw=atob(value.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
export function base64(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function concat(...parts:Uint8Array[]):Uint8Array<ArrayBuffer>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;}
export async function hash(value:string){return base64(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))));}
async function hmac(key:Uint8Array<ArrayBuffer>,data:Uint8Array<ArrayBuffer>){const imported=await crypto.subtle.importKey('raw',key,{name:'HMAC',hash:'SHA-256'},false,['sign']);return new Uint8Array(await crypto.subtle.sign('HMAC',imported,data));}
async function expand(key:Uint8Array<ArrayBuffer>,info:Uint8Array<ArrayBuffer>,length:number){return (await hmac(key,concat(info,new Uint8Array([1])))).slice(0,length);}
export function allowedPushEndpoint(endpoint:string){try{const u=new URL(endpoint);return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&(u.hostname==='fcm.googleapis.com'||u.hostname==='updates.push.services.mozilla.com'||u.hostname.endsWith('.push.services.mozilla.com')||u.hostname==='web.push.apple.com'||u.hostname.endsWith('.notify.windows.com'));}catch{return false;}}
export async function encryptPush(subscription:BrowserSubscription,payload:string){
 const userPublic=bytes64(subscription.keys.p256dh),auth=bytes64(subscription.keys.auth);
 const pair=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
 const serverPublic=new Uint8Array(await crypto.subtle.exportKey('raw',pair.publicKey));
 const userKey=await crypto.subtle.importKey('raw',userPublic,{name:'ECDH',namedCurve:'P-256'},false,[]);
 const shared=new Uint8Array(await crypto.subtle.deriveBits({name:'ECDH',public:userKey},pair.privateKey,256));
 const prk=await hmac(auth,shared),ikm=await expand(prk,concat(encoder.encode('WebPush: info\0'),userPublic,serverPublic),32);
 const salt=crypto.getRandomValues(new Uint8Array(16)),contentPrk=await hmac(salt,ikm);
 const cek=await expand(contentPrk,encoder.encode('Content-Encoding: aes128gcm\0'),16),nonce=await expand(contentPrk,encoder.encode('Content-Encoding: nonce\0'),12);
 const key=await crypto.subtle.importKey('raw',cek,'AES-GCM',false,['encrypt']);
 const plain=concat(encoder.encode(payload),new Uint8Array([2]));if(plain.length+16>4096)throw new Error('Push payload too large');
 const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce},key,plain));
 const header=new Uint8Array(21);header.set(salt);new DataView(header.buffer).setUint32(16,4096);header[20]=serverPublic.length;
 return concat(header,serverPublic,encrypted);
}
export async function vapidAuthorization(endpoint:string,privateJwk:JsonWebKey,publicKey:string,subject:string,now=Date.now()){
 const header=base64(encoder.encode(JSON.stringify({typ:'JWT',alg:'ES256'}))),claims=base64(encoder.encode(JSON.stringify({aud:new URL(endpoint).origin,exp:Math.floor(now/1000)+3600,sub:subject})));
 const input=header+'.'+claims,key=await crypto.subtle.importKey('jwk',privateJwk,{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 const sig=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,encoder.encode(input)));
 return `vapid t=${input}.${base64(sig)}, k=${publicKey}`;
}
export async function sendPush(subscription:BrowserSubscription,payload:PushPayload,config:{privateJwk:string;publicKey:string;subject:string},ttl=300){
 let stage='endpoint';try{
 if(!allowedPushEndpoint(subscription.endpoint))throw new Error('Unsupported push service');
 stage='encryption';
 const body=await encryptPush(subscription,JSON.stringify(payload));
 stage='signature';
 const authorization=await vapidAuthorization(subscription.endpoint,JSON.parse(config.privateJwk),config.publicKey,config.subject);
 stage='transport';
 // This Worker runtime supports follow/manual only. Return 3xx to the caller
 // rather than following it and forwarding VAPID credentials to another host.
 const response=await fetch(subscription.endpoint,{method:'POST',headers:{Authorization:authorization,'Content-Encoding':'aes128gcm','Content-Type':'application/octet-stream',TTL:String(Math.max(0,Math.floor(ttl))),Urgency:'normal'},body,redirect:'manual',signal:AbortSignal.timeout(10000)});
 return response.status;
 }catch(error){throw new PushDeliveryError(stage,error);}
}
export async function diagnosePush(config:{privateJwk:string;publicKey:string;subject:string}){
 try{const pair=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);const raw=new Uint8Array(await crypto.subtle.exportKey('raw',pair.publicKey));const subscription={endpoint:'https://updates.push.services.mozilla.com/wpush/v2/diagnostic',keys:{p256dh:base64(raw),auth:base64(crypto.getRandomValues(new Uint8Array(16)))}};const status=await sendPush(subscription,{title:'Diagnostic',body:'Test',tag:'diagnostic',url:'/'},config);return {ok:true,transportStatus:status};}catch(error){return {ok:false,error:pushErrorInfo(error)};}
}
