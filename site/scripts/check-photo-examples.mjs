import sharp from 'sharp';
import {build} from 'esbuild';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createWorker,PSM} from 'tesseract.js';
await build({stdin:{contents:'export * from "./lib/photo-image.ts";export * from "./lib/photo-recognition.ts";',resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'.sites-runtime/photo-examples.mjs'});
const {findPhotoGrid,extractPhotoCell,preparePhotoCell,parsePhotoCell}=await import('../.sites-runtime/photo-examples.mjs');
const ids=['9ef4bfd8-6882-4bc3-bf64-146f1c23bbad','fd19b86d-9c88-49d9-9d1a-23aca5995e8c','b83d31f3-ce61-44c4-bbb1-e53c5b55d9a2','dd1175fd-3449-4d7f-b2fd-05328d1e98b0','eb903b80-0dc2-4805-8bb2-9df50f428b2a','d549dc30-518f-412a-ab91-af9459a9b61c','7092e537-7561-4f30-af25-17d4c0abb36a','b10869ab-520e-41c2-bb5e-acb3bf014608'];
const results=[];
const worker=process.argv.includes('--ocr')?await createWorker('ukr+eng',1,{langPath:process.cwd()+'/public/ocr/lang',cachePath:process.cwd()+'/.sites-runtime',gzip:true}):null;
if(worker)await worker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_LINE,preserve_interword_spaces:'1',user_defined_dpi:'300'});
try{
for(const [i,id] of ids.entries()){
 const path=`C:/Users/0009/AppData/Local/Temp/codex-clipboard-${id}.png`;
 const {data,info}=await sharp(path).resize({width:1600,withoutEnlargement:true}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const image={width:info.width,height:info.height,data:new Uint8ClampedArray(data)};
 const secondary=findPhotoGrid(image,6,8),primary=[3,6].includes(i)?findPhotoGrid(image,4,6):undefined;
 assert.ok(secondary,`Secondary grid in example ${i+1}`);if(primary!==undefined)assert.ok(primary,`Primary grid in example ${i+1}`);
 const result={date:['2026-10-07','2026-10-06','2026-10-05','2026-10-02','2026-09-29','2026-09-28','2026-09-24','2026-09-23'][i],secondary,primary};results.push(result);console.log(result.date,!!secondary,primary===undefined?'':!!primary);
 if(worker){
  const {data:original,info:full}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true}),fullImage={width:full.width,height:full.height,data:new Uint8ClampedArray(original)};
  result.cells=[];
  for(const [name,grid] of [['secondary',secondary],['primary',primary]]){
   if(!grid)continue;
   for(let r=0;r<grid.ys.length-1;r++)for(let c=0;c<grid.xs.length-1;c++){
    const cell=extractPhotoCell(fullImage,grid,c,r);const content={width:cell.width-24,height:cell.height-24,data:new Uint8ClampedArray((cell.width-24)*(cell.height-24)*4)};for(let y=0;y<content.height;y++)content.data.set(cell.data.subarray(((y+12)*cell.width+12)*4,((y+12)*cell.width+12+content.width)*4),y*content.width*4);const prepared=preparePhotoCell(content);const cleaned=new Uint8ClampedArray(cell.data.length).fill(255);for(let y=0;y<content.height;y++)cleaned.set(prepared.pixels.subarray(y*content.width*4,(y+1)*content.width*4),((y+12)*cell.width+12)*4);prepared.pixels=cleaned;
    if(prepared.blank){result.cells.push({table:name,column:c,row:r,lesson:null});continue;}
    const png=await sharp(Buffer.from(prepared.pixels),{raw:{width:cell.width,height:cell.height,channels:4}}).png().toBuffer();
    await worker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_LINE});let {data}=await worker.recognize(png),parsed=parsePhotoCell(data.text);
    const needsRoom=name==='secondary',rank=(p,confidence)=>(p.known?2:0)+(p.lesson?.room?1:0)+confidence/100;
    if(!parsed.known||needsRoom&&!parsed.lesson?.room||data.confidence<85){
     const originalPng=await sharp(Buffer.from(cell.data),{raw:{width:cell.width,height:cell.height,channels:4}}).png().toBuffer(),retry=(await worker.recognize(originalPng)).data,retryParsed=parsePhotoCell(retry.text);
     if(rank(retryParsed,retry.confidence)>rank(parsed,data.confidence)){data=retry;parsed=retryParsed;}
     if(!parsed.known||needsRoom&&!parsed.lesson?.room||data.confidence<75){await worker.setParameters({tessedit_pageseg_mode:PSM.SINGLE_BLOCK});const block=(await worker.recognize(originalPng)).data,p=parsePhotoCell(block.text);if(rank(p,block.confidence)>rank(parsed,data.confidence)){data=block;parsed=p;}}
    }
    result.cells.push({table:name,column:c,row:r,raw:data.text.trim(),confidence:data.confidence,...parsed});
   }
  }
  console.log('OCR',result.cells.filter(c=>c.lesson).length,'nonblank;',result.cells.filter(c=>c.lesson&&!c.known).length,'unknown subjects');
 }
}
await fs.mkdir('.qa',{recursive:true});await fs.writeFile('.qa/photo-example-grids.json',JSON.stringify(results,null,2));
}finally{await worker?.terminate();}
