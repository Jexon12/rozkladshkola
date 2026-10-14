import assert from 'node:assert/strict';
const origin='http://127.0.0.1:5173',login=await fetch(origin+'/signin-with-chatgpt?return_to=/',{redirect:'manual'}),cookie=login.headers.getSetCookie().map(c=>c.split(';')[0]).join('; '),headers={Cookie:cookie};
const anonymous=await fetch(origin+'/api/schedule/history');assert.equal(anonymous.status,401);
const invalid=await fetch(origin+'/api/schedule/history?revision=bad',{headers});assert.equal(invalid.status,400);
const list=await fetch(origin+'/api/schedule/history',{headers});assert.equal(list.status,200);const {versions}=await list.json();assert.ok(versions.length>=2);
const current=await (await fetch(origin+'/api/schedule')).json(),saved=await fetch(origin+'/api/schedule/history?revision='+current.revision,{headers});assert.equal(saved.status,200);assert.deepEqual((await saved.json()).school,current.school);
const previous=await fetch(origin+'/api/schedule/history?revision='+versions[1].revision,{headers});assert.equal(previous.status,200);assert.ok((await previous.json()).school);
console.log('History API checks passed: owner-only access, revision validation, snapshot listing, exact current snapshot and earlier version retrieval.');
