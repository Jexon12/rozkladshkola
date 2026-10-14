import fs from 'node:fs/promises';
let p=await fs.readFile('app/photo-import.tsx','utf8');
p=p.replace('{parsePhotoCell,type PhotoEntry}','{parsePhotoCell,parsePhotoDate,type PhotoEntry}');
p=p.replace('const [gridReady,setGridReady]=useState(false);',`const [gridReady,setGridReady]=useState(false);
 const [automatic,setAutomatic]=useState(true),[tables,setTables]=useState<{classes:string[];grid:NonNullable<ReturnType<typeof findPhotoGrid>>}[]>([]),[suggestedDate,setSuggestedDate]=useState(''),[dateReviewed,setDateReviewed]=useState(false),[onlyUncertain,setOnlyUncertain]=useState(false);
 const uncertain=(r:Candidate)=>!r.known||(!r.lesson?.room&&!['1','2','3','4'].includes(r.classId))||r.confidence<75;`);
p=p.replace('function preset(primary:boolean){','function preset(primary:boolean){setAutomatic(false);setTables([]);');
p=p.replace('function choose(f:File){clear();','function choose(f:File){clear();setAutomatic(true);setTables([]);setSuggestedDate(\'\');setDateReviewed(false);');
p=p.replace("const grid=findPhotoGrid(ctx.getImageData(0,0,canvas.width,canvas.height),classIds.length,rowCount,hasHeader,hasNumbers);",`const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
   if(automatic){const detected=[{classes:['1','2','3','4'],grid:findPhotoGrid(pixels,4,6)},{classes:['5','6','7','8','9-А','9-Б'],grid:findPhotoGrid(pixels,6,8)}].filter((t):t is {classes:string[];grid:NonNullable<ReturnType<typeof findPhotoGrid>>}=>!!t.grid);setTables(detected);setGridReady(detected.length>0);if(!detected.length){setError('Таблиці не знайдено. Оберіть потрібні класи й виділіть таблицю вручну.');setProgress('');}else setProgress('Знайдено '+detected.map(t=>t.classes.join(', ')).join(' та ')+'. Перевірте межі на фото.');return;}
   const grid=findPhotoGrid(pixels,classIds.length,rowCount,hasHeader,hasNumbers);`);
p=p.replace('if(!gridReady){','if(!gridReady){');
p=p.replace('if(!classIds.length||','if(!automatic&&(!classIds.length||').replace("classIds.some(c=>!classes.includes(c))){","classIds.some(c=>!classes.includes(c)))){");
p=p.replace('if(weights.length!==classIds.length||weights.some(w=>!Number.isFinite(w)||w<=0)){','if(!automatic&&(weights.length!==classIds.length||weights.some(w=>!Number.isFinite(w)||w<=0))){');
p=p.replace('if(rowWeights.length!==rowCount||rowWeights.some(w=>!Number.isFinite(w)||w<=0)){','if(!automatic&&(rowWeights.length!==rowCount||rowWeights.some(w=>!Number.isFinite(w)||w<=0))){');
p=p.replace('if(crop.left<0||','if(!automatic&&(crop.left<0||').replace("crop.top>=crop.bottom){","crop.top>=crop.bottom)){");
p=p.replace('const found:Candidate[]=[];',`const targets=automatic?tables:[{classes:classIds,grid:{xs:xEdges,ys:yEdges,rowSlopes:edgeSlopes.length?edgeSlopes:yEdges.map(()=>slope),columnSlopes,columnCenter}}];
   const jobs=targets.flatMap(t=>Array.from({length:t.grid.ys.length-1},(_,slot)=>t.classes.map((classId,column)=>({classId,column,slot,grid:t.grid}))).flat());
   const found:Candidate[]=[];`);
p=p.replace('for(let r=0;r<rowCount;r++)for(let c=0;c<classIds.length;c++){','for(const [index,{classId,column,slot,grid}] of jobs.entries()){');
p=p.replace('`${r*classIds.length+c+1} / ${rowCount*classIds.length}`','`${index+1} / ${jobs.length}`');
p=p.replace('`Розпізнавання ${r*classIds.length+c+1} / ${rowCount*classIds.length}`','`Розпізнавання ${index+1} / ${jobs.length}`');
p=p.replace('extractPhotoCell(fullPixels,{xs:xEdges,ys:yEdges,rowSlopes:edgeSlopes.length?edgeSlopes:yEdges.map(()=>slope),columnSlopes,columnCenter},c,r)','extractPhotoCell(fullPixels,grid,column,slot)');
p=p.replaceAll('classIds[c]','classId').replaceAll('slot:r,','slot,').replace('&&r<classBells(classId).length','&&slot<classBells(classId).length');
// Only the headline above the first detected table is used for suggesting a date.
p=p.replace('}finally{image.close();}if(!cancelled.current)',`const top=Math.max(1,Math.min(...targets.map(t=>t.grid.ys[0]))/100*image.height-12);canvas.width=image.width;canvas.height=Math.round(top);ctx.drawImage(image,0,0,image.width,top,0,0,canvas.width,canvas.height);await wait(activeWorker.setParameters({tessedit_pageseg_mode:PSM.SPARSE_TEXT}));const headline=(await wait(activeWorker.recognize(canvas))).data.text;const detectedDate=parsePhotoDate(headline);setSuggestedDate(detectedDate||'');if(detectedDate){setImportDate(detectedDate);setDateReviewed(false);}
   }finally{image.close();}if(!cancelled.current)`);
p=p.replace("setImportDate(date);setConfirmed(false);","setImportDate(date);setConfirmed(false);setDateReviewed(false);");
p=p.replace('if(!confirmed||!chosen.length)return;','if(!confirmed||!dateReviewed||!chosen.length)return;');
p=p.replace('setImportDate(e.target.value);setConfirmed(false);','setImportDate(e.target.value);setConfirmed(false);setDateReviewed(false);');
p=p.replace('cancelled.current=true;void worker.current?.terminate();', 'cancelled.current=true;run.current?.abort();void worker.current?.terminate().catch(()=>{});');
p=p.replace('<div className="ocr-actions"><button className="secondary-button" disabled={busy} onClick={()=>preset(false)}>',`<div className="ocr-actions"><button className="secondary-button" aria-pressed={automatic} disabled={busy} onClick={()=>{setAutomatic(true);setGridReady(false);clear();}}>Усі таблиці на фото</button><button className="secondary-button" aria-pressed={!automatic&&columns.startsWith('5')} disabled={busy} onClick={()=>preset(false)}>`);
p=p.replace('<button className="secondary-button" disabled={busy} onClick={()=>preset(true)}>','<button className="secondary-button" aria-pressed={!automatic&&columns.startsWith(\'1\')} disabled={busy} onClick={()=>preset(true)}>');
p=p.replace('  <div className="ocr-config">','  {!automatic&&<div className="ocr-config">');
p=p.replace('  </div>\n  <div className="ocr-actions">','  </div>}\n  <div className="ocr-actions">');
// Date stays visible in automatic mode; manual mode retains its existing date field.
p=p.replace('  <div className="ocr-actions">\n   <label>',`  {automatic&&<label className="ocr-date">Дата змін<input type="date" value={importDate} disabled={busy} onChange={e=>{setImportDate(e.target.value);setConfirmed(false);setDateReviewed(false);}}/></label>}
  <div className="ocr-actions">
   {!automatic&&<label>`);
p=p.replace('Є рядок заголовків класів</label>','Є рядок заголовків класів</label>}');
p=p.replace('   <label><input type="checkbox" checked={hasNumbers}','   {!automatic&&<label><input type="checkbox" checked={hasNumbers}').replace('Є колонка номерів уроків</label>','Є колонка номерів уроків</label>}');
p=p.replace('disabled={busy||!size.w} onClick={()=>{setSelecting','disabled={busy||!size.w||automatic} onClick={()=>{setSelecting');
p=p.replace('  <details className="ocr-fine-tune">','  {!automatic&&<details className="ocr-fine-tune">').replace('  </details>','  </details>}');
p=p.replace('   {gridReady&&<svg','   {automatic&&gridReady&&<svg className="ocr-grid-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{tables.map((t,k)=><g key={k}>{t.grid.xs.map((x,i)=><line key={\'x\'+i} x1={x+(t.grid.columnSlopes[i]||0)*size.h/size.w*(t.grid.ys[0]-t.grid.columnCenter)} x2={x+(t.grid.columnSlopes[i]||0)*size.h/size.w*(t.grid.ys.at(-1)!-t.grid.columnCenter)} y1={t.grid.ys[0]+t.grid.rowSlopes[0]*size.w/size.h*(x-50)} y2={t.grid.ys.at(-1)!+t.grid.rowSlopes.at(-1)!*size.w/size.h*(x-50)}/>)}{t.grid.ys.map((y,i)=><line key={\'y\'+i} x1={t.grid.xs[0]} x2={t.grid.xs.at(-1)} y1={y+t.grid.rowSlopes[i]*size.w/size.h*(t.grid.xs[0]-50)} y2={y+t.grid.rowSlopes[i]*size.w/size.h*(t.grid.xs.at(-1)!-50)}/>)}</g>)}</svg>}\n   {!automatic&&gridReady&&<svg');
p=p.replace(' {result.length>0&&<><p>',` {result.length>0&&<><div className="ocr-results-summary"><strong>{result.filter(r=>r.include).length} вибрано · {result.filter(uncertain).length} потребують перевірки</strong><label><input type="checkbox" checked={onlyUncertain} onChange={e=>setOnlyUncertain(e.target.checked)}/>Тільки непевні</label></div><div className="photo-date-check"><p>{suggestedDate?'Дата з заголовка: '+suggestedDate:'Дату на фото не вдалося визначити. Вкажіть її вручну.'}</p><label className="ocr-confirm"><input type="checkbox" checked={dateReviewed} onChange={e=>{setDateReviewed(e.target.checked);setConfirmed(false);}}/>Дата {importDate} відповідає фото</label></div><p>`);
p=p.replace('{result.map((r,i)=><tr','{result.map((r,i)=>onlyUncertain&&!uncertain(r)?null:<tr');
p=p.replace('disabled={!confirmed||!result.some','disabled={!confirmed||!dateReviewed||!result.some');
p=p.replace('Лінії шукаються після завантаження фото. Якщо на фото дві таблиці, оберіть 1–4 або 5–9 класи та знайдіть лінії вибраної таблиці.','Сайт знаходить і розпізнає обидві таблиці одним запуском. За потреби оберіть лише 1–4 або 5–9 класи. Дату з заголовка потрібно підтвердити.');
await fs.writeFile('app/photo-import.tsx',p);
