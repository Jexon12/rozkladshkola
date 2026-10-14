import fs from 'node:fs/promises';
let d=await fs.readFile('app/draft-recovery.tsx','utf8');
d=d.replace('revision,onRestore}:{','revision,date,classId,onRestore}:{').replace('revision:number;onRestore:(s:School)=>void','revision:number;date:string;classId:string;onRestore:(s:School,context?:{date?:string;classId?:string})=>void');
d=d.replace('savedAt:new Date().toISOString()','savedAt:new Date().toISOString(),date,classId').replace('dirty,revision]);','dirty,revision,date,classId]);');
d=d.replace('onRestore(recovery.school);','onRestore(recovery.school,{date:recovery.date,classId:recovery.classId});');
d=d.replace('Відновлення не змінює опублікований розклад.</p>','Відновлення не змінює опублікований розклад.</p>{dirty&&<p className="warning-text">Відновіть або відкиньте знайдену чернетку, щоб увімкнути локальне збереження нових правок.</p>}');
await fs.writeFile('app/draft-recovery.tsx',d);
let s=await fs.readFile('app/schedule.tsx','utf8');
s=s.replace('function restoreDraft(recovered:School){','function restoreDraft(recovered:School,context?:{date?:string;classId?:string}){if(context?.date)setDate(context.date);if(context?.classId)setSelected(context.classId);');
s=s.replace('revision={revision} onRestore={restoreDraft}/>', 'revision={revision} date={effectiveDate} classId={selected} onRestore={restoreDraft}/>');
// SaveHistory does not need date/class props.
s=s.replace('<SaveHistory revision={revision} dirty={dirty} onRestore={restoreDraft}/>', '<SaveHistory revision={revision} dirty={dirty} onRestore={restoreDraft}/>');
await fs.writeFile('app/schedule.tsx',s);
let p=await fs.readFile('app/photo-import.tsx','utf8');p=p.replace("className={!r.known||(!r.lesson?.room&&!['1','2','3','4'].includes(r.classId))||r.confidence<75?'uncertain':''}","className={uncertain(r)?'uncertain':''}");await fs.writeFile('app/photo-import.tsx',p);
