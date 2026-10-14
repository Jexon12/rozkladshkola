import fs from 'node:fs/promises';
let s=await fs.readFile('app/schedule.tsx','utf8');
s=s.replace('import PhotoImport from "./photo-import";',`import PhotoImport from "./photo-import";
import DraftRecovery from './draft-recovery';
import SaveHistory from './save-history';
import {roomConflicts} from '../lib/room-conflicts';`);
s=s.replace('function go(v:View){',`function restoreDraft(recovered:School){draftGeneration.current++;setDraft(clone(recovered));setDirty(true);setView('edit');setEditMode('changes');setNotice('Версію відкрито як чернетку. Перевірте розклад і календар перед збереженням.');}
 function go(v:View){`);
s=s.replace(' const subjects=Array.from',` const conflictDates=editMode==='changes'?[effectiveDate]:Array.from({length:5},(_,i)=>shift(monday,i));
 const conflicts=useMemo(()=>draft&&view==='edit'?roomConflicts(draft,conflictDates):[],[draft,view,effectiveDate,editMode]);
 const subjects=Array.from`);
s=s.replace('     {!ready&&<div className="loading"',`     <DraftRecovery enabled={canEdit} ready={ready} draft={draft} dirty={dirty} revision={revision} onRestore={restoreDraft}/>
     {!ready&&<div className="loading"`);
s=s.replace('     {editMode==="weekly"&&<section',`     <SaveHistory revision={revision} dirty={dirty} onRestore={restoreDraft}/>
     {conflicts.length>0&&<details className="panel conflicts-panel"><summary>{conflicts.length} можливих конфліктів кабінетів · перевірити</summary><p>Перевірка {editMode==='changes'?'на '+effectiveDate:'на обраний тиждень'}. Спільні заняття дозволені; попередження не блокують збереження.</p><ul>{conflicts.map((c,i)=><li key={i}><strong>{c.date} · каб. {c.room} · {c.classes.join(' і ')} класи</strong><span>{c.subjects.join(' / ')} · {c.time.join(' / ')}</span></li>)}</ul></details>}
     {editMode==="weekly"&&<section`);
s=s.replace('Чернетка зникне після оновлення сторінки; натисніть «Зберегти» або експортуйте резервну копію.','Чернетка зберігається на цьому пристрої; для публікації натисніть «Зберегти».');
// Keep one clear entry point for OCR; photo remains visible inside its panel.
const old='<label className="secondary-button"><Upload size={17}/>Відкрити фото<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)imageFile(f);e.target.value="";}}/></label>';
s=s.replace(old,'');
await fs.writeFile('app/schedule.tsx',s);
