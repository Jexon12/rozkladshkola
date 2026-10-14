"use client";
import {useEffect,useRef,useState} from 'react';
import {classes,classBells,rooms,weekday,type Lesson} from '../lib/school';
import {parsePhotoCell,parsePhotoDate,type PhotoEntry} from '../lib/photo-recognition';
import {findPhotoGrid,weightedEdges,preparePhotoCell,extractPhotoCell} from '../lib/photo-image';
import {abortable} from "../lib/abortable";
type Candidate=PhotoEntry & {raw:string;confidence:number;include:boolean;known:boolean;preview:string};
export default function PhotoImport({date,onApply}:{date:string;onApply:(entries:PhotoEntry[],date:string)=>void}){
 const [file,setFile]=useState<File|null>(null),[url,setUrl]=useState(''),[size,setSize]=useState({w:0,h:0}),[columns,setColumns]=useState('5, 6, 7, 8, 9-А, 9-Б'),[widths,setWidths]=useState(''),[rowCount,setRowCount]=useState(8),[crop,setCrop]=useState({left:4,top:15,right:99,bottom:55}),[result,setResult]=useState<Candidate[]>([]),[busy,setBusy]=useState(false),[progress,setProgress]=useState(''),[error,setError]=useState(''),[confirmed,setConfirmed]=useState(false),[importDate,setImportDate]=useState(date);
 const worker=useRef<import('tesseract.js').Worker|null>(null),cancelled=useRef(false),run=useRef<AbortController|null>(null);
 const [gridReady,setGridReady]=useState(false);
 const [automatic,setAutomatic]=useState(true),[tables,setTables]=useState<{classes:string[];grid:NonNullable<ReturnType<typeof findPhotoGrid>>}[]>([]),[suggestedDate,setSuggestedDate]=useState(''),[dateReviewed,setDateReviewed]=useState(false),[onlyUncertain,setOnlyUncertain]=useState(false);
 const uncertain=(r:Candidate)=>!!r.lesson&&(!r.known||(!r.lesson.room&&!['1','2','3','4'].includes(r.classId))||r.confidence<75);
 const [edgeSlopes,setEdgeSlopes]=useState<number[]>([]);
 const [columnSlopes,setColumnSlopes]=useState<number[]>([]),[columnCenter,setColumnCenter]=useState(50);
 function preset(primary:boolean){setSelecting(false);setCorner(null);setAutomatic(false);setTables([]);setColumns(primary?"1, 2, 3, 4":"5, 6, 7, 8, 9-А, 9-Б");setRowCount(primary?6:8);setGridReady(false);setWidths("");setHeights("");setEdgeSlopes([]);setColumnSlopes([]);clear();setProgress("Натисніть «Знайти лінії таблиці» для вибраних класів.");}
 const [replaceDay,setReplaceDay]=useState(false);
 const [heights,setHeights]=useState(''),[slope,setSlope]=useState(0),[hasHeader,setHasHeader]=useState(true),[hasNumbers,setHasNumbers]=useState(true),[selecting,setSelecting]=useState(false),[corner,setCorner]=useState<{x:number;y:number}|null>(null);
 useEffect(()=>{setImportDate(date);setConfirmed(false);setDateReviewed(false);},[date]);useEffect(()=>()=>{cancelled.current=true;run.current?.abort();void worker.current?.terminate().catch(()=>{});},[]);
 useEffect(()=>()=>{if(url)URL.revokeObjectURL(url);},[url]);
 const classIds=columns.split(',').map(c=>c.trim()).filter(Boolean);
 const weights=widths.trim()?widths.split(',').map(Number):classIds.map(()=>1);
 const rowWeights=heights.trim()?heights.split(',').map(Number):Array(rowCount).fill(1);
 const xEdges=weightedEdges(crop.left,crop.right,weights),yEdges=weightedEdges(crop.top,crop.bottom,rowWeights);

 function clear(){setReplaceDay(false);setResult([]);setConfirmed(false);setError('');}
 function choose(f:File){clear();setAutomatic(true);setTables([]);setSuggestedDate('');setDateReviewed(false);if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>15000000){setError('Оберіть фото PNG/JPEG/WebP до 15 МБ.');return;}setEdgeSlopes([]);setColumnSlopes([]);setGridReady(false);setFile(f);setUrl(URL.createObjectURL(f));setSize({w:0,h:0});setCorner(null);setSelecting(false);setWidths('');setHeights('');setSlope(0);}
 async function detect(){
  if(!file)return;clear();const controller=new AbortController();run.current=controller;setBusy(true);setProgress('Шукаємо лінії таблиці…');
  let bitmap:ImageBitmap|undefined;
  try{bitmap=await abortable(createImageBitmap(file),controller.signal,b=>b.close());const canvas=document.createElement('canvas'),scale=Math.min(1,1600/bitmap.width);canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);const ctx=canvas.getContext('2d')!;ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
   const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
   if(automatic){const detected=[{classes:['1','2','3','4'],grid:findPhotoGrid(pixels,4,6)},{classes:['5','6','7','8','9-А','9-Б'],grid:findPhotoGrid(pixels,6,8)}].filter((t):t is {classes:string[];grid:NonNullable<ReturnType<typeof findPhotoGrid>>}=>!!t.grid);setTables(detected);setGridReady(detected.length>0);if(!detected.length){setError('Таблиці не знайдено. Оберіть потрібні класи й виділіть таблицю вручну.');setProgress('');}else setProgress('Знайдено '+detected.map(t=>t.classes.join(', ')).join(' та ')+'. Перевірте межі на фото.');return;}
   const grid=findPhotoGrid(pixels,classIds.length,rowCount,hasHeader,hasNumbers);
   if(!grid){setError('Не вдалося знайти всі лінії. Виділіть комірки кнопкою «Виділити таблицю» та підлаштуйте ширини колонок і висоти рядків.');setProgress('');return;}
   setColumnSlopes(grid.columnSlopes);setColumnCenter(grid.columnCenter);setGridReady(true);setCrop({left:grid.xs[0],right:grid.xs.at(-1)!,top:grid.ys[0],bottom:grid.ys.at(-1)!});setSlope(grid.slope);setEdgeSlopes(grid.rowSlopes);setWidths(grid.xs.slice(1).map((x,i)=>(x-grid.xs[i]).toFixed(3)).join(', '));setHeights(grid.ys.slice(1).map((y,i)=>(y-grid.ys[i]).toFixed(3)).join(', '));setProgress('Межі знайдено. Звірте кожну лінію сітки з фото перед розпізнаванням.');
  }catch{if(!controller.signal.aborted)setError('Не вдалося прочитати фото. Спробуйте виділити таблицю вручну.');}finally{bitmap?.close();if(run.current===controller){run.current=null;setBusy(false);}}
 }
 function pickCorner(e:React.MouseEvent<HTMLDivElement>){if(!selecting||busy)return;const bounds=e.currentTarget.getBoundingClientRect(),p={x:(e.clientX-bounds.left)/bounds.width*100,y:(e.clientY-bounds.top)/bounds.height*100};if(!corner){setCorner(p);setProgress('Тепер натисніть нижній правий кут останньої комірки з уроком.');}else{const next={left:Math.min(corner.x,p.x),right:Math.max(corner.x,p.x),top:Math.min(corner.y,p.y),bottom:Math.max(corner.y,p.y)};if(next.right-next.left<2||next.bottom-next.top<2)return;setEdgeSlopes([]);setColumnSlopes([]);setGridReady(true);setCrop(next);setCorner(null);setSelecting(false);setWidths('');setHeights('');setSlope(0);clear();setProgress('Звірте внутрішні лінії сітки з межами комірок.');}}
 async function recognize(){
  clear();if(!file||!size.w)return;if(!gridReady){setError('Спочатку знайдіть лінії таблиці або виділіть комірки на фото.');return;}
  if(!automatic&&(!classIds.length||new Set(classIds).size!==classIds.length||classIds.some(c=>!classes.includes(c)))){setError('Вкажіть класи через кому в порядку колонок, наприклад 5, 6, 7, 8, 9-А, 9-Б.');return;}
  if(!automatic&&(weights.length!==classIds.length||weights.some(w=>!Number.isFinite(w)||w<=0))){setError('Кількість ширин має відповідати кількості класів; усі значення мають бути більші нуля.');return;}
  if(!automatic&&(rowWeights.length!==rowCount||rowWeights.some(w=>!Number.isFinite(w)||w<=0))){setError('Вкажіть одну додатну висоту для кожного рядка.');return;}
  if(!automatic&&(crop.left<0||crop.top<0||crop.right>100||crop.bottom>100||crop.left>=crop.right||crop.top>=crop.bottom)){setError('Перевірте межі таблиці.');return;}
  cancelled.current=false;const controller=new AbortController();run.current=controller;let activeWorker:import('tesseract.js').Worker|null=null;const wait=<T,>(promise:Promise<T>)=>abortable(promise,controller.signal);setBusy(true);setProgress('Завантаження розпізнавання…');
  try{
   const {createWorker,PSM}=await import('tesseract.js');
   const origin=window.location.origin;
   activeWorker=await abortable(createWorker('ukr+eng',1,{workerPath:origin+'/ocr/worker.min.js',corePath:origin+'/ocr/core',langPath:origin+'/ocr/lang',workerBlobURL:false}),controller.signal,w=>{void w.terminate().catch(()=>{});});worker.current=activeWorker;
   if(cancelled.current)return;
   await wait(activeWorker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_LINE,preserve_interword_spaces:'1',user_defined_dpi:'300'}));
   const image=await abortable(createImageBitmap(file),controller.signal,b=>b.close());const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d')!;
   const fullCanvas=document.createElement("canvas");fullCanvas.width=image.width;fullCanvas.height=image.height;const fullContext=fullCanvas.getContext("2d")!;fullContext.drawImage(image,0,0);const fullPixels=fullContext.getImageData(0,0,image.width,image.height);
   const targets=automatic?tables:[{classes:classIds,grid:{xs:xEdges,ys:yEdges,rowSlopes:edgeSlopes.length?edgeSlopes:yEdges.map(()=>slope),columnSlopes,columnCenter}}];
   const jobs=targets.flatMap(t=>Array.from({length:t.grid.ys.length-1},(_,slot)=>t.classes.map((classId,column)=>({classId,column,slot,grid:t.grid}))).flat());
   const found:Candidate[]=[];
   try{
   for(const [index,{classId,column,slot,grid}] of jobs.entries()){
    if(cancelled.current)return;setProgress(`Розпізнавання ${index+1} / ${jobs.length}`);
    const cell=extractPhotoCell(fullPixels,grid,column,slot),padding=12;canvas.width=cell.width;canvas.height=cell.height;ctx.putImageData(new ImageData(new Uint8ClampedArray(cell.data),cell.width,cell.height),0,0);
    const preview=canvas.toDataURL('image/png'),original=ctx.getImageData(0,0,canvas.width,canvas.height);
    // Clean shadows and remove border remnants, retaining a white OCR margin.
    const content=ctx.getImageData(padding,padding,canvas.width-2*padding,canvas.height-2*padding),prepared=preparePhotoCell(content),cleaned=prepared.pixels;
    if(prepared.blank){found.push({classId:classId,slot,raw:'',confidence:0,lesson:null,known:false,preview,include:false});continue;}ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.putImageData(new ImageData(cleaned,content.width,content.height),padding,padding);
    await wait(activeWorker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_LINE}));
    let {data}=await wait(activeWorker.recognize(canvas)),parsed=parsePhotoCell(data.text);
    if(!parsed.known||(!parsed.lesson?.room&&!['1','2','3','4'].includes(classId))||data.confidence<85){
     const rank=(p:ReturnType<typeof parsePhotoCell>,confidence:number)=>(p.known?2:0)+(p.lesson?.room?1:0)+confidence/100;
     ctx.putImageData(original,0,0);
     const retry=(await wait(activeWorker.recognize(canvas))).data,retryParsed=parsePhotoCell(retry.text);
     if(rank(retryParsed,retry.confidence)>rank(parsed,data.confidence)){data=retry;parsed=retryParsed;}
     if(!parsed.known||(!parsed.lesson?.room&&!['1','2','3','4'].includes(classId))||data.confidence<75){ctx.putImageData(original,0,0);await wait(activeWorker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_BLOCK}));const block=(await wait(activeWorker.recognize(canvas))).data,blockParsed=parsePhotoCell(block.text);if(rank(blockParsed,block.confidence)>rank(parsed,data.confidence)){data=block;parsed=blockParsed;}}
    }
    found.push({classId:classId,slot,raw:data.text.trim(),confidence:data.confidence,lesson:parsed.lesson,known:parsed.known,preview,include:parsed.known&&!(!parsed.lesson?.room&&!['1','2','3','4'].includes(classId))&&data.confidence>=75&&slot<classBells(classId).length});
   }
   const top=Math.max(1,Math.min(...targets.map(t=>t.grid.ys[0]))/100*image.height-12);canvas.width=image.width;canvas.height=Math.round(top);ctx.drawImage(image,0,0,image.width,top,0,0,canvas.width,canvas.height);await wait(activeWorker.setParameters({tessedit_pageseg_mode:PSM.SPARSE_TEXT}));const headline=(await wait(activeWorker.recognize(canvas))).data.text;const detectedDate=parsePhotoDate(headline);setSuggestedDate(detectedDate||'');if(detectedDate){setImportDate(detectedDate);setDateReviewed(false);}
   }finally{image.close();}if(!cancelled.current){setResult(found);setProgress('Перевірте предмети, кабінети, групи та дату. Непевні результати не вибрані.');}
  }catch(e){if(!cancelled.current)setError('Не вдалося розпізнати: '+(e as Error).message);}
  finally{await activeWorker?.terminate().catch(()=>{});if(run.current===controller){run.current=null;worker.current=null;setBusy(false);}}
 }
 function update(i:number,fn:(r:Candidate)=>void){setResult(prev=>prev.map((r,j)=>{if(i!==j)return r;const copy=structuredClone(r);fn(copy);return copy;}));setConfirmed(false);}
 function apply(){
  const chosen=result.filter(r=>r.slot<classBells(r.classId).length&&(r.include||replaceDay&&r.lesson===null));if(!confirmed||!dateReviewed||!chosen.length)return;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(importDate)||Number.isNaN(Date.parse(importDate))||new Date(importDate+'T12:00:00Z').toISOString().slice(0,10)!==importDate||weekday(importDate)<0||weekday(importDate)>4){setError('Оберіть правильну дату з понеділка до п’ятниці.');return;}
  if(chosen.some(r=>r.slot>=classBells(r.classId).length||r.lesson&&(!r.lesson.subject.trim()||r.lesson.subject.length>150))){setError('Перевірте предмети й доступні номери уроків.');return;}
  onApply(chosen.map(({classId,slot,lesson})=>({classId,slot,lesson})),importDate);setResult([]);setConfirmed(false);setProgress('Додано в чернетку.');
 }
 return <section className="panel ocr-panel"><h2>Розпізнати зміни з фото</h2><p>Фото обробляється на вашому пристрої. Сайт знаходить і розпізнає обидві таблиці одним запуском. За потреби оберіть лише 1–4 або 5–9 класи. Дату з заголовка потрібно підтвердити. Сітка має охоплювати лише уроки: без заголовків, номерів зліва й легенди. Кожна червона лінія має збігатися з межею комірки.</p><label className="secondary-button">Обрати фото<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)choose(f);e.target.value='';}}/></label>
 {url&&<>
  <div className="ocr-actions"><button className="secondary-button" aria-pressed={automatic} disabled={busy} onClick={()=>{setSelecting(false);setCorner(null);setAutomatic(true);setGridReady(false);clear();setProgress('Натисніть «Знайти лінії таблиці» для всіх таблиць.');}}>Усі таблиці на фото</button><button className="secondary-button" aria-pressed={!automatic&&columns.startsWith('5')} disabled={busy} onClick={()=>preset(false)}>Таблиця 5–9 класів</button><button className="secondary-button" aria-pressed={!automatic&&columns.startsWith('1')} disabled={busy} onClick={()=>preset(true)}>Таблиця 1–4 класів</button></div>
  {!automatic&&<div className="ocr-config">
   <label>Класи зліва направо<input value={columns} disabled={busy} onChange={e=>{setColumns(e.target.value);setGridReady(false);setColumnSlopes([]);clear();}}/></label>
   <label>Кількість рядків з уроками<select value={rowCount} disabled={busy} onChange={e=>{setRowCount(Number(e.target.value));setEdgeSlopes([]);setColumnSlopes([]);setGridReady(false);setHeights('');clear();}}>{[5,6,7,8].map(n=><option key={n}>{n}</option>)}</select></label>
   <label>Дата змін<input type="date" value={importDate} disabled={busy} onChange={e=>{setImportDate(e.target.value);setConfirmed(false);setDateReviewed(false);}}/></label>
  </div>}
  {automatic&&<label className="ocr-date">Дата змін<input type="date" value={importDate} disabled={busy} onChange={e=>{setImportDate(e.target.value);setConfirmed(false);setDateReviewed(false);}}/></label>}
  <div className="ocr-actions">
   {!automatic&&<label><input type="checkbox" checked={hasHeader} disabled={busy} onChange={e=>{setHasHeader(e.target.checked);setGridReady(false);}}/> Є рядок заголовків класів</label>}
   {!automatic&&<label><input type="checkbox" checked={hasNumbers} disabled={busy} onChange={e=>{setHasNumbers(e.target.checked);setGridReady(false);}}/> Є колонка номерів уроків</label>}
   <button className="secondary-button" disabled={busy||!size.w} onClick={()=>void detect()}>Знайти лінії таблиці</button>
   <button className="secondary-button" disabled={busy||!size.w||automatic} onClick={()=>{setSelecting(!selecting);setCorner(null);setProgress(selecting?'':'Натисніть верхній лівий кут першої комірки з уроком — під заголовком і праворуч від номерів.');}}>{selecting?'Скасувати виділення':'Виділити таблицю'}</button>
  </div>
  {!automatic&&<details className="ocr-fine-tune"><summary>Уточнити сітку вручну</summary>
   <label>Нахил рядків, °<input type="number" min="-4" max="4" step="0.1" value={Number((Math.atan(slope)*180/Math.PI).toFixed(2))} disabled={busy} onChange={e=>{setEdgeSlopes([]);setColumnSlopes([]);setSlope(Math.tan(Number(e.target.value)*Math.PI/180));clear();}}/></label>
   <div className="ocr-config"><label>Ширини колонок через кому<input value={widths} placeholder="Порожньо — однакові" disabled={busy} onChange={e=>{setWidths(e.target.value);clear();}}/></label><label>Висоти рядків через кому<input value={heights} placeholder="Порожньо — однакові" disabled={busy} onChange={e=>{setEdgeSlopes([]);setColumnSlopes([]);setHeights(e.target.value);clear();}}/></label></div>
   <div className="crop-fields">{(['left','top','right','bottom'] as const).map((key,i)=><label key={key}>{['Ліва межа, %','Верхня межа, %','Права межа, %','Нижня межа, %'][i]}<input type="number" min="0" max="100" step="0.1" value={Number(crop[key].toFixed(2))} disabled={busy} onChange={e=>{setEdgeSlopes([]);setColumnSlopes([]);setGridReady(true);setCrop(p=>({...p,[key]:Number(e.target.value)}));clear();}}/></label>)}</div>
  </details>}
  <div className={`ocr-image ${selecting?'selecting':''}`} onClick={pickCorner}>
   <img src={url} alt="Фото з межами таблиці для розпізнавання" onLoad={e=>{setSize({w:e.currentTarget.naturalWidth,h:e.currentTarget.naturalHeight});void detect();}} onError={()=>{setGridReady(false);setBusy(false);setError('Фото не вдалося відкрити. Оберіть оригінальний файл PNG або JPEG ще раз.');}}/>
   {automatic&&gridReady&&<svg className="ocr-grid-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{tables.map((t,k)=><g key={k}>{t.grid.xs.map((x,i)=><line key={'x'+i} x1={x+(t.grid.columnSlopes[i]||0)*size.h/size.w*(t.grid.ys[0]-t.grid.columnCenter)} x2={x+(t.grid.columnSlopes[i]||0)*size.h/size.w*(t.grid.ys.at(-1)!-t.grid.columnCenter)} y1={t.grid.ys[0]+t.grid.rowSlopes[0]*size.w/size.h*(x-50)} y2={t.grid.ys.at(-1)!+t.grid.rowSlopes.at(-1)!*size.w/size.h*(x-50)}/>)}{t.grid.ys.map((y,i)=><line key={'y'+i} x1={t.grid.xs[0]} x2={t.grid.xs.at(-1)} y1={y+t.grid.rowSlopes[i]*size.w/size.h*(t.grid.xs[0]-50)} y2={y+t.grid.rowSlopes[i]*size.w/size.h*(t.grid.xs.at(-1)!-50)}/>)}</g>)}</svg>}
   {!automatic&&gridReady&&<svg className="ocr-grid-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    {xEdges.filter(Number.isFinite).map((x,i)=><line key={'x'+i} x1={x+(columnSlopes[i]||0)*size.h/Math.max(1,size.w)*(crop.top-columnCenter)} x2={x+(columnSlopes[i]||0)*size.h/Math.max(1,size.w)*(crop.bottom-columnCenter)} y1={crop.top+(edgeSlopes[0]??slope)*size.w/Math.max(1,size.h)*(x-50)} y2={crop.bottom+(edgeSlopes.at(-1)??slope)*size.w/Math.max(1,size.h)*(x-50)}/>)}
    {yEdges.filter(Number.isFinite).map((y,i)=><line key={'y'+i} x1={crop.left} x2={crop.right} y1={y+(edgeSlopes[i]??slope)*size.w/Math.max(1,size.h)*(crop.left-50)} y2={y+(edgeSlopes[i]??slope)*size.w/Math.max(1,size.h)*(crop.right-50)}/>)}
   </svg>}
   {corner&&<span className="ocr-corner" style={{left:corner.x+'%',top:corner.y+'%'}}/>}
  </div>
  <div className="ocr-actions"><button className="primary-button" disabled={busy||!size.w||selecting||!gridReady} onClick={()=>void recognize()}>Розпізнати таблицю</button>{busy&&<button className="secondary-button" onClick={()=>{cancelled.current=true;run.current?.abort();void worker.current?.terminate().catch(()=>{});setProgress('Скасовано');}}>Скасувати</button>}<span role="status">{progress}</span></div>
 </>}
 {error&&<div className="alert error" role="alert">{error}</div>}
 {result.length>0&&<><div className="ocr-results-summary"><strong>{result.filter(r=>r.include).length} вибрано · {result.filter(uncertain).length} потребують перевірки</strong><label><input type="checkbox" checked={onlyUncertain} onChange={e=>setOnlyUncertain(e.target.checked)}/>Тільки непевні</label></div><div className="photo-date-check"><p>{suggestedDate?'Дата з заголовка: '+suggestedDate:'Дату на фото не вдалося визначити. Вкажіть її вручну.'}</p><label className="ocr-confirm"><input type="checkbox" checked={dateReviewed} onChange={e=>{setDateReviewed(e.target.checked);setConfirmed(false);}}/>Дата {importDate} відповідає фото</label></div><p>Позначте комірки, які потрібно застосувати. Порожні комірки не скасовують урок автоматично: для скасування позначте рядок і очистіть предмет.</p><label className="ocr-confirm"><input type="checkbox" checked={replaceDay} onChange={e=>{setReplaceDay(e.target.checked);setConfirmed(false);}}/>Фото містить повний денний розклад: застосувати порожні комірки як скасування уроків</label><div className="ocr-review"><table><thead><tr><th>Додати</th><th>Клас / урок</th><th>Предмет</th><th>Кабінет</th><th>Група</th><th>З фото</th></tr></thead><tbody>{result.map((r,i)=>onlyUncertain&&!uncertain(r)?null:<tr key={i} className={uncertain(r)?'uncertain':''}><td><input aria-label={`Застосувати ${r.classId} урок ${r.slot+1}`} type="checkbox" checked={r.include} disabled={r.slot>=classBells(r.classId).length} onChange={e=>update(i,c=>{c.include=e.target.checked;})}/></td><td>{r.classId} · {r.slot+1}</td><td><input aria-label={`Предмет ${r.classId} урок ${r.slot+1}`} value={r.lesson?.subject||''} placeholder="Скасувати урок" onChange={e=>update(i,c=>{c.lesson=e.target.value.trim()?{...(c.lesson||{room:''}),subject:e.target.value}:null;})}/></td><td><select aria-label={`Кабінет ${r.classId} урок ${r.slot+1}`} value={r.lesson?.room||''} disabled={!r.lesson} onChange={e=>update(i,c=>{if(c.lesson)c.lesson.room=e.target.value;})}><option value="">Не вказано</option>{Object.keys(rooms).map(v=><option key={v}>{v}</option>)}</select></td><td><select aria-label={`Група ${r.classId} урок ${r.slot+1}`} value={r.lesson?.group||''} disabled={!r.lesson} onChange={e=>update(i,c=>{if(c.lesson)c.lesson.group=e.target.value;})}><option value="">Весь клас</option><option>I</option><option>II</option><option>Усі</option></select></td><td><img className="ocr-cell-preview" src={r.preview} alt={`Комірка ${r.classId}, урок ${r.slot+1}`} /><small>{r.lesson?.note&&<strong>{r.lesson.note}<br/></strong>}{r.raw||'Порожня комірка'}<br/>{Math.round(r.confidence)}%</small></td></tr>)}</tbody></table></div><label className="ocr-confirm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>Я звірив дату, вибрані уроки, кабінети та групи з фото</label><button className="primary-button" disabled={!confirmed||!dateReviewed||!result.some(r=>r.include||replaceDay&&r.lesson===null)} onClick={apply}>Додати вибрані зміни в чернетку</button></>}
 </section>;
}
