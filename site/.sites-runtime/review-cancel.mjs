import {createWorker} from 'tesseract.js';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const worker=await createWorker('ukr',1,{langPath:process.cwd()+'/public/ocr/lang',cachePath:process.cwd()+'/.sites-runtime',gzip:true});
const pixels=Buffer.alloc(1800*1800*3);for(let i=0;i<pixels.length;i++)pixels[i]=(i*13+i%151)%256;
const png=await sharp(pixels,{raw:{width:1800,height:1800,channels:3}}).png().toBuffer();
let status='pending';worker.recognize(png).then(()=>status='resolved',()=>status='rejected');
await new Promise(r=>setTimeout(r,50));await worker.terminate();await new Promise(r=>setTimeout(r,500));
assert.equal(status,'pending');console.log('Pending recognize promise after terminate:',status);
