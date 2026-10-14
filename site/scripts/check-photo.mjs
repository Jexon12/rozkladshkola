import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({stdin:{contents:'export * from "./lib/photo-image.ts"; export * from "./lib/photo-recognition.ts";',resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'.sites-runtime/photo-check.mjs'});
const {findPhotoGrid,weightedEdges,cleanPhoto,preparePhotoCell,parsePhotoCell}=await import('../.sites-runtime/photo-check.mjs');
assert.deepEqual(weightedEdges(10,90,[1,3]),[10,30,90]);
const width=600,height=450,data=new Uint8ClampedArray(width*height*4);
for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4,v=190+Math.round(x/30);data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;}
const xs=[20,45,130,225,310,405,490,580],ys=[50,70,103,139,172,206,239,274,309,343],slope=.0125;
for(let y=40;y<360;y++)for(let x=20;x<=580;x++){
 const line=xs.includes(x)&&y>=50+slope*(x-width/2)&&y<=343+slope*(x-width/2)||ys.some(v=>Math.abs(y-v-slope*(x-width/2))<1);
 if(line){const i=(y*width+x)*4;data[i]=data[i+1]=data[i+2]=65;}
}
const grid=findPhotoGrid({width,height,data},6,8);
assert.ok(grid,'Complete tilted table detected');assert.equal(grid.xs.length,7);assert.equal(grid.ys.length,9);
assert.ok(Math.abs(grid.ys[0]*height/100-70)<5,'Class headers excluded without dropping first lesson');
assert.ok(Math.abs(grid.ys.at(-1)*height/100-343)<5,'Footer excluded');
assert.ok(Math.abs(grid.xs[0]*width/100-45)<5,'Lesson number column excluded');
assert.equal(findPhotoGrid({width:100,height:100,data:new Uint8ClampedArray(40000).fill(255)},6,8),null);
assert.equal(cleanPhoto({width:100,height:100,data:new Uint8ClampedArray(40000).fill(255)})[0],255);
assert.deepEqual(parsePhotoCell('Інформатика IH (ІІ)').lesson,{subject:'Інформатика',room:'ІН',group:'II'});
assert.deepEqual(parsePhotoCell('Інформатика ВСІ КБ').lesson,{subject:'Інформатика',room:'КБ',group:'Усі'});
assert.equal(parsePhotoCell('Фіз. куль. C3').lesson.subject,'Фізична культура');
assert.equal(parsePhotoCell('Математнка M').lesson.subject,'Математика');
assert.equal(parsePhotoCell('Бюлогія Б').lesson.subject,'Біологія');
assert.equal(parsePhotoCell('нерозбірливий текст').known,false);
assert.deepEqual(parsePhotoCell(' | Математика М. |\n').lesson,{subject:'Математика',room:'М'});
assert.deepEqual(parsePhotoCell('Інформатика (IT) ІН').lesson,{subject:'Інформатика',room:'ІН',group:'II'});
assert.deepEqual(parsePhotoCell('Інформатика BCI KB').lesson,{subject:'Інформатика',room:'КБ',group:'Усі'});
assert.deepEqual(parsePhotoCell('Інформатика (І!) ІН').lesson,{subject:'Інформатика',room:'ІН',group:'II'});
assert.deepEqual(parsePhotoCell('Вих.година ТІ').lesson,{subject:'Виховна година',room:'ТП'});
assert.deepEqual(parsePhotoCell('Англ.мова (заміна) АМ').lesson,{subject:'Англійська мова',room:'АМ',note:'Заміна'});
assert.equal(parsePhotoCell('STEMM').lesson.room,'М');
assert.equal(parsePhotoCell('Bux.roauna М').lesson.subject,'Виховна година');
assert.equal(parsePhotoCell('Ффіз.культ C3').lesson.subject,'Фізична культура');
// A trapezoid: each horizontal line has its own angle, as on phone photographs.
const perspectiveData=new Uint8ClampedArray(width*height*4).fill(255),angles=ys.map((_,i)=>-.005-i*.0025);
for(let y=35;y<370;y++)for(let x=20;x<=580;x++){
 if(xs.includes(x)&&y>=50&&y<=343||ys.some((v,i)=>Math.abs(y-v-angles[i]*(x-width/2))<1)){
  const p=(y*width+x)*4;perspectiveData[p]=perspectiveData[p+1]=perspectiveData[p+2]=65;
 }
}
const perspectiveGrid=findPhotoGrid({width,height,data:perspectiveData},6,8);
assert.ok(perspectiveGrid,'Perspective grid detected');assert.equal(perspectiveGrid.rowSlopes.length,9);
assert.ok(Math.abs(perspectiveGrid.rowSlopes[0]-perspectiveGrid.rowSlopes.at(-1))>.008,'Each row keeps its own perspective angle');
const cell={width:220,height:60,data:new Uint8ClampedArray(220*60*4).fill(255)};
function blackRect(x,y,w,h){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const i=(yy*cell.width+xx)*4;cell.data[i]=cell.data[i+1]=cell.data[i+2]=0;}}
blackRect(0,0,2,60);blackRect(10,39,180,2);
assert.equal(preparePhotoCell(cell).blank,true,'A border and cancellation dash are not text');
blackRect(25,15,3,22);blackRect(41,15,3,22);blackRect(25,24,19,3);blackRect(55,15,3,22);
assert.equal(preparePhotoCell(cell).blank,false,'Letter stems including Roman I survive cleanup');
console.log('Photo checks passed: tilted grid, header/number/footer exclusion, unequal sizes, blank photos, OCR character errors, rooms and groups.');
