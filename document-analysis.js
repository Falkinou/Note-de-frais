(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.DocumentAnalysis=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function integral(values,w,h){
    const out=new Float64Array((w+1)*(h+1));
    for(let y=0;y<h;y++){let row=0;for(let x=0;x<w;x++){row+=values[y*w+x];out[(y+1)*(w+1)+x+1]=out[y*(w+1)+x+1]+row;}}
    return out;
  }
  function sum(table,w,x0,y0,x1,y1){const s=w+1;return table[y1*s+x1]-table[y0*s+x1]-table[y1*s+x0]+table[y0*s+x0];}
  function analyze(image){
    const {width:w,height:h,data}=image;
    if(w<4||h<4||w*h>1600000||data.length!==w*h*4)throw new Error('Image d’analyse invalide');
    const gray=new Float32Array(w*h),hist=new Uint32Array(256);
    for(let i=0;i<gray.length;i++){gray[i]=data[4*i]*.299+data[4*i+1]*.587+data[4*i+2]*.114;hist[Math.round(gray[i])]++;}
    const table=integral(gray,w,h),ink=new Uint8Array(w*h),radius=Math.max(4,Math.round(Math.min(w,h)/60));
    let inkCount=0,lap=0,gradient=0,edgeCount=0,borderInk=0,borderCount=0;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=y*w+x,x0=Math.max(0,x-radius),x1=Math.min(w,x+radius+1),y0=Math.max(0,y-radius),y1=Math.min(h,y+radius+1);
      const mean=sum(table,w,x0,y0,x1,y1)/((x1-x0)*(y1-y0));
      if(gray[i]<mean-7){ink[i]=1;inkCount++;}
      if(x<2||x>=w-2||y<2||y>=h-2){borderInk+=ink[i];borderCount++;}
      if(x>2&&y>2&&x<w-3&&y<h-3){
        const gx=(gray[i+1]-gray[i-1])/2,gy=(gray[i+w]-gray[i-w])/2,g=gx*gx+gy*gy;
        if(g>9){const l=4*gray[i]-gray[i-1]-gray[i+1]-gray[i-w]-gray[i+w];lap+=l*l;gradient+=g;edgeCount++;}
      }
    }
    // Grow glyph edges, protecting pale print and the space immediately around it.
    const mask=new Uint8Array(w*h),inkTable=integral(ink,w,h),pad=Math.max(2,Math.round(Math.min(w,h)/180));
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      if(sum(inkTable,w,Math.max(0,x-pad),Math.max(0,y-pad),Math.min(w,x+pad+1),Math.min(h,y+pad+1)))mask[y*w+x]=1;
    }
    const warnings=[];
    // Conservative hints, never a gate: optical blur cannot be established with certainty.
    const sharpness=gradient?lap/gradient:0;
    if(edgeCount>w*h*.002 && edgeCount>w*.3 && sharpness<.55)warnings.push('blur');
    if(borderInk/Math.max(1,borderCount)>.035 && inkCount/w/h>.008)warnings.push('edges');
    let total=0,paper=0;
    for(let i=0;i<256;i++){total+=hist[i];if(total>=w*h*.8){paper=i;break;}}
    if(paper<110)warnings.push('dark');
    // A compact, clipped-white island within a darker image can be glare; a white
    // sheet or white background touching the frame is deliberately not flagged.
    if(paper<225){
      const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
      for(let seed=0;seed<gray.length;seed++){
        if(seen[seed]||gray[seed]<252)continue;
        let head=0,tail=1,touches=false,minX=w,maxX=0,minY=h,maxY=0;queue[0]=seed;seen[seed]=1;
        while(head<tail){
          const i=queue[head++],x=i%w,y=(i/w)|0;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
          if(x===0||x===w-1||y===0||y===h-1)touches=true;
          for(const j of [x>0?i-1:-1,x<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1])if(j>=0&&!seen[j]&&gray[j]>=252){seen[j]=1;queue[tail++]=j;}
        }
        if(!touches&&tail>w*h*.025&&tail<w*h*.35&&tail/((maxX-minX+1)*(maxY-minY+1))>.55){warnings.push('glare');break;}
      }
    }
    return {w,h,mask,gray,warnings,sharpness,inkFraction:inkCount/w/h};
  }
  function inspect(image){const a=analyze(image);return {warnings:a.warnings,sharpness:a.sharpness,inkFraction:a.inkFraction};}
  function placement(image,bounds){
    const {w,h,mask,gray}=analyze(image),table=integral(mask,w,h),light=integral(gray,w,h);
    const bw=Math.min(w,Math.max(3,Math.ceil(bounds.width*w))),bh=Math.min(h,Math.max(3,Math.ceil(bounds.height*h)));
    const margin=Math.max(2,Math.round(Math.min(w,h)*.012)),step=Math.max(2,Math.round(Math.min(w,h)/120));
    let best=null;
    for(let y=margin;y+bh<=h-margin;y+=step)for(let x=margin;x+bw<=w-margin;x+=step){
      const occupied=sum(table,w,x,y,x+bw,y+bh)/(bw*bh),brightness=sum(light,w,x,y,x+bw,y+bh)/(bw*bh);
      const score=occupied*1000+(255-brightness)/255+(1-(y+bh/2)/h)*.02;
      if(!best||score<best.score)best={score,occupied,x:(x+bw/2)/w*100,y:(y+bh/2)/h*100};
    }
    if(!best)return {x:50,y:75,clear:false,occupied:1};
    return {x:best.x,y:best.y,clear:best.occupied<.003,occupied:best.occupied};
  }
  return {inspect,placement};
});
