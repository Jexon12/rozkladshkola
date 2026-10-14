import {Miniflare} from 'miniflare';
import {build} from 'esbuild';
const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const privateJwk=await crypto.subtle.exportKey('jwk',pair.privateKey),publicKey=Buffer.from(await crypto.subtle.exportKey('raw',pair.publicKey)).toString('base64url');
const source=`import {base64,encryptPush,vapidAuthorization} from './lib/web-push.ts';
export default {async fetch(request,env){let stage='keys';try{const p=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);const raw=new Uint8Array(await crypto.subtle.exportKey('raw',p.publicKey));const sub={endpoint:'https://updates.push.services.mozilla.com/wpush/v2/test',keys:{p256dh:base64(raw),auth:base64(crypto.getRandomValues(new Uint8Array(16)))}};stage='encryption';await encryptPush(sub,'test');stage='signature';await vapidAuthorization(sub.endpoint,JSON.parse(env.DIAG_PRIVATE),env.DIAG_PUBLIC,'mailto:test@example.org');return Response.json({ok:true});}catch(e){return Response.json({stage,name:e.name,message:e.message});}}};`;
const result=await build({stdin:{contents:source,resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',write:false});
const mf=new Miniflare({modules:true,compatibilityDate:'2026-05-15',script:result.outputFiles[0].text,bindings:{DIAG_PRIVATE:JSON.stringify(privateJwk),DIAG_PUBLIC:publicKey}});
try{const response=await mf.dispatchFetch('http://localhost');console.log(await response.json());}finally{await mf.dispose();}
