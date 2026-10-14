export type Pixels = {width:number;height:number;data:Uint8ClampedArray};

// Local background subtraction keeps print dark on photographs with shadows.
export function cleanPhoto(data:Pixels,contrast=14):Uint8ClampedArray<ArrayBuffer> {
 const {width:w,height:h}=data,gray=new Float32Array(w*h),sum=new Float64Array((w+1)*(h+1));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x,p=i*4;gray[i]=data.data[p]*.299+data.data[p+1]*.587+data.data[p+2]*.114;
  sum[(y+1)*(w+1)+x+1]=gray[i]+sum[y*(w+1)+x+1]+sum[(y+1)*(w+1)+x]-sum[y*(w+1)+x];
 }
 const out=new Uint8ClampedArray(w*h*4),radius=Math.max(8,Math.round(h/12));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const l=Math.max(0,x-radius),r=Math.min(w,x+radius+1),t=Math.max(0,y-radius),b=Math.min(h,y+radius+1);
  const mean=(sum[b*(w+1)+r]-sum[t*(w+1)+r]-sum[b*(w+1)+l]+sum[t*(w+1)+l])/((r-l)*(b-t));
  const value=gray[y*w+x]<mean-contrast?0:255,i=(y*w+x)*4;out[i]=out[i+1]=out[i+2]=value;out[i+3]=255;
 }
 return out;
}

function clusters(values:number[]):number[]{
 const groups:number[][]=[];
 for(const v of values){const g=groups.at(-1);if(g&&v-g.at(-1)!<=3)g.push(v);else groups.push([v]);}
 return groups.map(g=>g[Math.floor(g.length/2)]);
}

// Only accept a complete ruled grid. Never guess missing boundaries.
export function findPhotoGrid(image:Pixels,columns:number,rows:number,header=true,numbers=true):{xs:number[];ys:number[];slope:number;rowSlopes:number[];columnSlopes:number[];columnCenter:number}|null {
 const {width:w,height:h}=image,pixels=cleanPhoto(image,8),dark=(x:number,y:number)=>pixels[(y*w+x)*4]===0;
 // Ignore colored selection overlays in screenshots; printed grid lines are neutral.
 for(let i=0;i<pixels.length;i+=4)if(image.data[i]>image.data[i+1]+60&&image.data[i]>image.data[i+2]+60)pixels[i]=pixels[i+1]=pixels[i+2]=255;
 const candidates:{y:number;slope:number;score:number}[]=[];
 function lineScore(y:number,slope:number){let hits=0;for(let x=0;x<w;x++){const yy=Math.round(y+slope*(x-w/2));if(yy>0&&yy<h-1&&(dark(x,yy)||dark(x,yy-1)||dark(x,yy+1)))hits++;}return hits;}
 for(const slope of [0,...Array.from({length:32},(_,i)=>(i+1)*.0025).flatMap(s=>[s,-s])]){
 const horizontal:number[]=[];
 for(let y=1;y<h-1;y++){
  let run=0,best=0,hits=0;
  for(let x=0;x<w;x++){const yy=Math.round(y+slope*(x-w/2)),hit=yy>=3&&yy<h-3&&(dark(x,yy)||dark(x,yy-1)||dark(x,yy+1)||dark(x,yy-2)||dark(x,yy+2)||dark(x,yy-3)||dark(x,yy+3));run=hit?run+1:0;if(hit)hits++;best=Math.max(best,run);}
  if(best>w*.55||hits>w*.7)horizontal.push(y);
 }
 for(const y of clusters(horizontal)){let best=y,score=0;for(let yy=Math.max(1,y-4);yy<=Math.min(h-2,y+4);yy++){const value=lineScore(yy,slope);if(value>score){score=value;best=yy;}}candidates.push({y:best,slope,score});}
 }
 // Perspective changes the angle from one row to the next. Fit each rule separately.
 const rules:typeof candidates=[];
 for(const candidate of candidates.sort((a,b)=>b.score-a.score))if(!rules.some(rule=>Math.abs(rule.y-candidate.y)<=10))rules.push(candidate);
 rules.sort((a,b)=>a.y-b.y);
 const gaps=rules.slice(1).map((r,i)=>r.y-rules[i].y).sort((a,b)=>a-b),separation=Math.min(18,(gaps[Math.floor(gaps.length/2)]||16)*.6);
 const spaced:typeof rules=[];for(const rule of [...rules].sort((a,b)=>b.score-a.score))if(!spaced.some(r=>Math.abs(r.y-rule.y)<separation))spaced.push(rule);
 rules.splice(0,rules.length,...spaced.sort((a,b)=>a.y-b.y));const lines=rules.map(rule=>rule.y),required=rows+1+(header?1:0);
 let bestGrid:ReturnType<typeof findPhotoGrid>=null,bestScore=0;
 for(let start=0;start+required<=lines.length;start++){
  const selected=lines.slice(start,start+required),heights=selected.slice(1).map((v,i)=>v-selected[i]);
  if(Math.min(...heights)<4||Math.max(...heights)>Math.min(...heights)*2.5)continue;
  const lessonHeights=header?heights.slice(1):heights,median=[...lessonHeights].sort((a,b)=>a-b)[Math.floor(lessonHeights.length/2)];
  if(lessonHeights.some(height=>height<median*.8||height>median*1.25))continue;
  const top=selected[0],bottom=selected.at(-1)!,middle=(top+bottom)/2,vertical:{x:number;slope:number;score:number}[]=[];
  for(let x=1;x<w-1;x++){
   let best={x,slope:0,score:0};
   for(let tilt=-.12;tilt<=.1201;tilt+=.005){
    let hits=0,count=0;for(let y=Math.ceil(top-50);y<bottom+50;y+=2){const xx=Math.round(x+tilt*(y-middle));if(y<top+rules[start].slope*(xx-w/2)+8||y>bottom+rules[start+required-1].slope*(xx-w/2)-8||y<1||y>=h-1)continue;count++;if(xx>1&&xx<w-2&&(dark(xx,y)||dark(xx-1,y)||dark(xx+1,y)))hits++;}
    const score=hits/count;if(score>best.score)best={x,slope:tilt,score};
   }
   if(best.score>.8)vertical.push(best);
  }
  const strongest=rules.slice(start,start+required).reduce((a,b)=>a.score>b.score?a:b),runs:number[][]=[];
  for(let x=0;x<w;x++){const y=Math.round(strongest.y+strongest.slope*(x-w/2));if(y<1||y>=h-1||!(dark(x,y)||dark(x,y-1)||dark(x,y+1)))continue;const run=runs.at(-1);if(run&&x-run.at(-1)!<=10)run.push(x);else runs.push([x]);}
  const span=runs.sort((a,b)=>b.length-a.length)[0];if(!span)continue;
  const edges:typeof vertical=[];for(const v of vertical.sort((a,b)=>b.score-a.score))if(!edges.some(e=>Math.abs(e.x-v.x)<10))edges.push(v);edges.sort((a,b)=>a.x-b.x);
  const needed=columns+1+(numbers?1:0),kept=edges.length===needed?edges:edges.filter(e=>e.x>=span[0]-w*.08&&e.x<=span.at(-1)!+w*.08),xs=kept.map(e=>e.x);
  if(xs.length!==needed)continue;
  const lessonWidths=xs.slice(numbers?2:1).map((x,i)=>x-xs[i+(numbers?1:0)]);if(Math.min(...lessonWidths)<20||Math.max(...lessonWidths)>Math.min(...lessonWidths)*2)continue;
  const selectedRules=rules.slice(start,start+required),score=selectedRules.reduce((sum,rule)=>sum+rule.score,0),lessonRules=header?selectedRules.slice(1):selectedRules;
  if(score>bestScore){bestScore=score;bestGrid={xs:(numbers?xs.slice(1):xs).map(x=>x/w*100),ys:lessonRules.map(rule=>rule.y/h*100),slope:lessonRules.reduce((sum,rule)=>sum+rule.slope,0)/lessonRules.length,rowSlopes:lessonRules.map(rule=>rule.slope),columnSlopes:(numbers?kept.slice(1):kept).map(e=>e.slope),columnCenter:middle/h*100};}
 }
 return bestGrid;
}

export function weightedEdges(start:number,end:number,weights:number[]):number[]{
 const total=weights.reduce((a,b)=>a+b,0),edges=[start];
 for(const weight of weights)edges.push(edges.at(-1)!+(end-start)*weight/total);
 return edges;
}

// Rectify a quadrilateral cell using the intersections of its four fitted rules.
export function extractPhotoCell(image:Pixels,grid:{xs:number[];ys:number[];rowSlopes:number[];columnSlopes:number[];columnCenter:number},column:number,row:number):Pixels {
 const {width:w,height:h}=image;
 function corner(c:number,r:number){const a=grid.rowSlopes[r]||0,b=grid.columnSlopes[c]||0,x0=grid.xs[c]*w/100,y0=grid.ys[r]*h/100,yc=grid.columnCenter*h/100;const y=(y0+a*(x0-b*yc-w/2))/(1-a*b);return {x:x0+b*(y-yc),y};}
 const tl=corner(column,row),tr=corner(column+1,row),bl=corner(column,row+1),br=corner(column+1,row+1);
 const cellW=(tr.x-tl.x+br.x-bl.x)/2,cellH=(bl.y-tl.y+br.y-tr.y)/2;
 if(cellW<10||cellH<8)throw new Error('Комірки надто малі. Перевірте межі таблиці.');
 const scale=Math.min(5,Math.max(2,48/cellH)),padding=12,width=Math.round(cellW*scale)+padding*2,height=Math.round(cellH*scale)+padding*2,data=new Uint8ClampedArray(width*height*4).fill(255);
 const inset=2;
 for(let y=padding;y<height-padding;y++)for(let x=padding;x<width-padding;x++){
  const u=(x-padding)/(width-padding*2-1),v=(y-padding)/(height-padding*2-1),uu=(inset+u*(cellW-2*inset))/cellW,vv=(inset+v*(cellH-2*inset))/cellH;
  const sx=(1-vv)*(tl.x+(tr.x-tl.x)*uu)+vv*(bl.x+(br.x-bl.x)*uu),sy=(1-vv)*(tl.y+(tr.y-tl.y)*uu)+vv*(bl.y+(br.y-bl.y)*uu),ix=Math.round(sx),iy=Math.round(sy);
  if(ix<0||iy<0||ix>=w||iy>=h)continue;const src=(iy*w+ix)*4,dst=(y*width+x)*4;for(let k=0;k<3;k++)data[dst+k]=image.data[src+k];
 }
 return {width,height,data};
}

export function removeCellLines(image:Pixels):void {
 const {width:w,height:h,data}=image,rows:number[]=[],cols:number[]=[];
 for(let y=0;y<h;y++){let hits=0;for(let x=0;x<w;x++)if(data[(y*w+x)*4]===0)hits++;if(hits>w*.55)rows.push(y);}
 for(let x=0;x<w;x++){let hits=0;for(let y=0;y<h;y++)if(data[(y*w+x)*4]===0)hits++;if(hits>h*.65)cols.push(x);}
 for(const y of rows)for(let x=0;x<w;x++){const i=(y*w+x)*4;data[i]=data[i+1]=data[i+2]=255;}
 for(const x of cols)for(let y=0;y<h;y++){const i=(y*w+x)*4;data[i]=data[i+1]=data[i+2]=255;}
}

// Retain text-sized components; long rules and edge fragments are not letters.
export function preparePhotoCell(image:Pixels):{pixels:Uint8ClampedArray<ArrayBuffer>;blank:boolean} {
 const {width:w,height:h}=image,pixels=cleanPhoto(image),seen=new Uint8Array(w*h),boxes:{left:number;right:number;top:number;bottom:number}[]=[];
 removeCellLines({width:w,height:h,data:pixels});
 const stack:number[]=[];
 for(let p=0;p<w*h;p++){
  if(seen[p]||pixels[p*4]!==0)continue;
  seen[p]=1;stack.push(p);let left=w,right=0,top=h,bottom=0,area=0;
  while(stack.length){const i=stack.pop()!,x=i%w,y=Math.floor(i/w);area++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,n=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!seen[n]&&pixels[n*4]===0){seen[n]=1;stack.push(n);}}
  }
  const bh=bottom-top+1,bw=right-left+1;
  if(area>=8&&bh>=h*.18&&bh<h*.85&&bw<Math.max(h*2,w*.7)&&bw>=bh*.05&&left>1&&right<w-2)boxes.push({left,right,top,bottom});
 }
 // One text line: border debris separated from the main baseline is discarded.
 const bins=new Map<number,typeof boxes>();
 for(const box of boxes){const key=Math.round((box.top+box.bottom)/2/(h*.15));bins.set(key,[...(bins.get(key)||[]),box]);}
 let textBoxes:typeof boxes=[];
 for(const [key] of bins){const nearby=boxes.filter(b=>Math.abs((b.top+b.bottom)/2-key*h*.15)<h*.2);if(nearby.length>textBoxes.length)textBoxes=nearby;}
 if(textBoxes.length<2){pixels.fill(255);return {pixels,blank:true};}
 const l=Math.max(0,Math.min(...textBoxes.map(b=>b.left))-5),r=Math.min(w-1,Math.max(...textBoxes.map(b=>b.right))+5),t=Math.max(0,Math.min(...textBoxes.map(b=>b.top))-6),b=Math.min(h-1,Math.max(...textBoxes.map(b=>b.bottom))+6);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(x<l||x>r||y<t||y>b){const i=(y*w+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=255;}
 return {pixels,blank:false};
}
