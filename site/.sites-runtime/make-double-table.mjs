import sharp from 'sharp';
let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#fff"/><text x="250" y="40" font-family="Times New Roman" font-size="28">Зміни в розкладі на четвер 24 вересня 2026 рік</text>';
function table(y,classes,rows){const x=40,w=1520,number=38,header=32,rh=42,cw=(w-number)/classes.length;
 for(let r=0;r<=rows+1;r++){const yy=y+(r===0?0:header+(r-1)*rh);svg+=`<path d="M ${x} ${yy} H ${x+w}" stroke="#000" fill="none"/>`;}
 for(const xx of [x,x+number,...classes.map((_,i)=>x+number+(i+1)*cw)])svg+=`<path d="M ${xx} ${y} V ${y+header+rows*rh}" stroke="#000" fill="none"/>`;
 classes.forEach((c,i)=>svg+=`<text x="${x+number+i*cw+cw/2}" y="${y+24}" font-family="Times New Roman" font-size="23">${c}</text>`);
 for(let r=0;r<rows;r++){svg+=`<text x="${x+10}" y="${y+header+r*rh+28}" font-size="20">${r+1}</text>`;for(let i=0;i<classes.length;i++)if(r<4)svg+=`<text x="${x+number+i*cw+9}" y="${y+header+r*rh+28}" font-family="Times New Roman" font-size="20">${r===0?'Математика М':r===1?'Укр.мова УМ':r===2?'Мистецтво ІСТ':'Англ.мова АМ'}</text>`;}
}
table(70,['1','2','3','4'],6);table(390,['5','6','7','8','9-А','9-Б'],8);svg+='</svg>';await sharp(Buffer.from(svg)).png().toFile('.qa/double-table-fixture.png');
