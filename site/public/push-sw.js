self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
 let data={title:'Матроська гімназія',body:'Відкрийте актуальний розклад.',url:'/'};
 try{if(event.data)data={...data,...event.data.json()};}catch{}
 event.waitUntil(self.registration.showNotification(data.title,{body:data.body,tag:data.tag,icon:'/push-icon-192.png',badge:'/push-icon-192.png',data:{url:data.url},renotify:false}));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();event.waitUntil((async()=>{
  const target=new URL(event.notification.data?.url||'/',self.location.origin);if(target.origin!==self.location.origin)return;
  const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of windows){if(new URL(client.url).origin===target.origin){await client.navigate(target.href);await client.focus();return;}}
  await self.clients.openWindow(target.href);
 })());
});
