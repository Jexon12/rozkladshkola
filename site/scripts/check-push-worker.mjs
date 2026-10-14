import assert from 'node:assert/strict';
import {Miniflare} from 'miniflare';
import {build} from 'esbuild';
const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const jwk=await crypto.subtle.exportKey('jwk',pair.privateKey),pub=Buffer.from(await crypto.subtle.exportKey('raw',pair.publicKey)).toString('base64url');
const result=await build({stdin:{resolveDir:process.cwd(),contents:`
 import {base64,sendPush,pushErrorInfo} from './lib/web-push.ts';
 export default {async fetch(request,env){try{
  const path=new URL(request.url).pathname,pair=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
  const sub={endpoint:'https://updates.push.services.mozilla.com'+path,keys:{p256dh:base64(new Uint8Array(await crypto.subtle.exportKey('raw',pair.publicKey))),auth:base64(crypto.getRandomValues(new Uint8Array(16)))}};
  const status=await sendPush(sub,{title:'Перевірка',body:'8 клас',tag:'test',url:'/'},{privateJwk:path==='/bad-key'?'{}':env.JWK,publicKey:env.PUB,subject:'mailto:test@example.org'});
  return Response.json({status});
 }catch(e){return Response.json({error:pushErrorInfo(e)});}}};`},bundle:true,format:'esm',platform:'browser',write:false});
const seen=[];
const mf=new Miniflare({modules:true,compatibilityDate:'2026-05-15',script:result.outputFiles[0].text,bindings:{JWK:JSON.stringify(jwk),PUB:pub},outboundService:async request=>{
 const u=new URL(request.url);assert.equal(u.hostname,'updates.push.services.mozilla.com','Never forward credentials to a redirect destination');assert.equal(request.method,'POST');assert.equal(request.headers.get('Content-Encoding'),'aes128gcm');assert.ok(request.headers.get('Authorization')?.startsWith('vapid t='));assert.ok((await request.arrayBuffer()).byteLength>86);seen.push(u.pathname);
 return u.pathname==='/ok'?new Response('accepted',{status:201}):new Response(null,{status:302,headers:{Location:'https://other.example/steal'}});
}});
try{
 assert.deepEqual(await (await mf.dispatchFetch('http://localhost/ok')).json(),{status:201},'Full encryption, VAPID and fetch must work inside workerd');
 assert.deepEqual(await (await mf.dispatchFetch('http://localhost/redirect')).json(),{status:302},'Return redirects without forwarding credentials');
 const bad=await (await mf.dispatchFetch('http://localhost/bad-key')).json();assert.equal(bad.error.stage,'signature');
 assert.deepEqual(seen,['/ok','/redirect']);
 console.log('Worker push checks passed: real workerd encryption/signature/transport, accepted delivery, redirects blocked, invalid signing key diagnosed.');
}finally{await mf.dispose();}
