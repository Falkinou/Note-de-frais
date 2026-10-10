(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ReceiptPixels = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const cross = (a, b, c) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const distance = (a, b) => Math.hypot(a.x-b.x, a.y-b.y);
  const fullFrame = () => [{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}];
  function area(points) {
    return points.reduce((sum, p, i) => { const q=points[(i+1)%points.length]; return sum+p.x*q.y-q.x*p.y; }, 0)/2;
  }
  function validQuad(points, minimumArea=40) {
    return Array.isArray(points) && points.length===4 && points.every(p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x>=0 && p.x<=100 && p.y>=0 && p.y<=100) &&
      area(points)>=minimumArea && points.every((p,i) => distance(p,points[(i+1)%4])>=2 && cross(p,points[(i+1)%4],points[(i+2)%4])>4);
  }
  function rotateQuad(points) { return [points[3],points[0],points[1],points[2]].map(p => ({x:100-p.y,y:p.x})); }
  function checkImage(image) {
    if (!image || !Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width<2 || image.height<2 || image.width*image.height>6000000 || image.data.length!==image.width*image.height*4) throw new Error('Image invalide');
  }
  function grayscale(image) {
    const values=new Float32Array(image.width*image.height), data=image.data;
    for (let i=0;i<values.length;i++) values[i]=data[i*4]*.299+data[i*4+1]*.587+data[i*4+2]*.114;
    return values;
  }
  function percentile(hist, count, fraction) {
    let total=0;
    for (let i=0;i<256;i++) { total+=hist[i]; if(total>=count*fraction)return i; }
    return 255;
  }
  function otsu(hist, count) {
    let weighted=0; for(let i=0;i<256;i++)weighted+=hist[i]*i;
    let before=0,sum=0,best=0,threshold=128;
    for(let i=0;i<255;i++) {
      before+=hist[i];sum+=hist[i]*i;
      if(!before || before===count)continue;
      const difference=sum/before-(weighted-sum)/(count-before);
      const score=before*(count-before)*difference*difference;
      if(score>best){best=score;threshold=i;}
    }
    return threshold;
  }
  function hull(points) {
    points.sort((a,b) => a.x-b.x || a.y-b.y);
    const lower=[],upper=[];
    for(const p of points){while(lower.length>1 && cross(lower[lower.length-2],lower[lower.length-1],p)<=0)lower.pop();lower.push(p);}
    for(let i=points.length-1;i>=0;i--){const p=points[i];while(upper.length>1 && cross(upper[upper.length-2],upper[upper.length-1],p)<=0)upper.pop();upper.push(p);}
    lower.pop();upper.pop();return lower.concat(upper);
  }
  function fourCorners(contour) {
    const points=hull(contour);
    while(points.length>4){
      let smallest=Infinity,index=0;
      for(let i=0;i<points.length;i++){
        const loss=Math.abs(cross(points[(i+points.length-1)%points.length],points[i],points[(i+1)%points.length]));
        if(loss<smallest){smallest=loss;index=i;}
      }
      points.splice(index,1);
    }
    if(points.length!==4)return null;
    let first=0;for(let i=1;i<4;i++)if(points[i].x+points[i].y<points[first].x+points[first].y)first=i;
    return points.slice(first).concat(points.slice(0,first));
  }
  function detect(image) {
    checkImage(image);
    const {width:w,height:h}=image,n=w*h;
    if(Math.max(w,h)>600)throw new Error('Analyse limitée à 600 pixels');
    const raw=grayscale(image),gray=new Float32Array(raw),hist=new Uint32Array(256);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const i=y*w+x;gray[i]=(raw[i]*4+raw[i-1]+raw[i+1]+raw[i-w]+raw[i+w])/8;
    }
    for(const v of gray)hist[Math.round(v)]++;
    const bright=percentile(hist,n,.9),dark=percentile(hist,n,.1);
    if(bright-dark<24)return {found:false,points:fullFrame()};
    const thresholds=[otsu(hist,n)+5,bright*.7,bright*.84];
    let best=null;
    const queue=new Int32Array(n);
    for(const threshold of thresholds){
      const visited=new Uint8Array(n);
      for(let seed=0;seed<n;seed++){
        if(visited[seed] || gray[seed]<=threshold)continue;
        let head=0,tail=1,count=0,borders=0;queue[0]=seed;visited[seed]=1;
        const contour=[];
        while(head<tail){
          const i=queue[head++],x=i%w,y=(i/w)|0;count++;
          let boundary=false;
          if(x===0)borders|=1;if(x===w-1)borders|=2;if(y===0)borders|=4;if(y===h-1)borders|=8;
          const neighbours=[x>0?i-1:-1,x<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1];
          for(const next of neighbours){
            if(next<0 || gray[next]<=threshold){boundary=true;continue;}
            if(!visited[next]){visited[next]=1;queue[tail++]=next;}
          }
          if(boundary)contour.push({x,y});
        }
        if(count<n*.07 || count>n*.94 || [1,2,4,8].filter(b=>borders&b).length>=3)continue;
        const quad=fourCorners(contour);if(!quad)continue;
        const quadArea=area(quad),fraction=quadArea/n,fill=count/quadArea;
        const normalized=quad.map(p=>({x:p.x/(w-1)*100,y:p.y/(h-1)*100}));
        if(!validQuad(normalized,650) || fraction>.94 || fill<.76 || fill>1.12)continue;
        const contrasts=[];
        for(let side=0;side<4;side++){
          const a=quad[side],b=quad[(side+1)%4],length=distance(a,b),nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length;
          let sum=0,samples=0;
          for(let step=3;step<=17;step++){
            const x=a.x+(b.x-a.x)*step/20,y=a.y+(b.y-a.y)*step/20;
            const ix=Math.round(x+nx*3),iy=Math.round(y+ny*3),ox=Math.round(x-nx*3),oy=Math.round(y-ny*3);
            if(Math.min(ix,ox)<0 || Math.max(ix,ox)>=w || Math.min(iy,oy)<0 || Math.max(iy,oy)>=h)continue;
            sum+=gray[iy*w+ix]-gray[oy*w+ox];samples++;
          }
          contrasts.push(samples?sum/samples:0);
        }
        // Every edge must separate paper from background. An internal shadow or
        // lines of print alone should never trigger an automatic destructive crop.
        if(Math.min(...contrasts)<9)continue;
        const mean=contrasts.reduce((a,b)=>a+b,0)/4;
        const score=fraction*Math.min(fill,1)*Math.sqrt(Math.min(mean,100));
        if(!best || score>best.score)best={score,points:normalized};
      }
    }
    if(!best)return {found:false,points:fullFrame()};
    const center=best.points.reduce((a,p)=>({x:a.x+p.x/4,y:a.y+p.y/4}),{x:0,y:0});
    const padded=best.points.map(p=>({x:clamp(center.x+(p.x-center.x)*1.015,0,100),y:clamp(center.y+(p.y-center.y)*1.015,0,100)}));
    return {found:true,points:validQuad(padded)?padded:best.points};
  }
  function homography(points) {
    const [p0,p1,p2,p3]=points;
    const dx1=p1.x-p2.x,dx2=p3.x-p2.x,dx3=p0.x-p1.x+p2.x-p3.x;
    const dy1=p1.y-p2.y,dy2=p3.y-p2.y,dy3=p0.y-p1.y+p2.y-p3.y;
    let g=0,h=0;
    if(Math.abs(dx3)+Math.abs(dy3)>1e-8){
      const determinant=dx1*dy2-dx2*dy1;
      if(Math.abs(determinant)<1e-8)throw new Error('Coins trop proches');
      g=(dx3*dy2-dx2*dy3)/determinant;h=(dx1*dy3-dx3*dy1)/determinant;
    }
    return [p1.x-p0.x+g*p1.x,p3.x-p0.x+h*p3.x,p0.x,p1.y-p0.y+g*p1.y,p3.y-p0.y+h*p3.y,p0.y,g,h];
  }
  function rectify(image, points, maxPixels=2400) {
    checkImage(image);if(!validQuad(points))throw new Error('Recadrage invalide');
    const p=points.map(p=>({x:p.x/100*(image.width-1),y:p.y/100*(image.height-1)}));
    const width=Math.max(distance(p[0],p[1]),distance(p[3],p[2]))+1,height=Math.max(distance(p[0],p[3]),distance(p[1],p[2]))+1;
    const ratio=Math.min(1,clamp(maxPixels,2,2400)/Math.max(width,height),Math.sqrt(4000000/(width*height)));
    const w=Math.max(2,Math.round(width*ratio)),h=Math.max(2,Math.round(height*ratio));
    const matrix=homography(p),out=new Uint8ClampedArray(w*h*4),source=image.data,iw=image.width,ih=image.height;
    for(let y=0;y<h;y++){
      const v=y/(h-1);
      for(let x=0;x<w;x++){
        const u=x/(w-1),den=matrix[6]*u+matrix[7]*v+1;
        const sx=clamp((matrix[0]*u+matrix[1]*v+matrix[2])/den,0,iw-1),sy=clamp((matrix[3]*u+matrix[4]*v+matrix[5])/den,0,ih-1);
        const x0=Math.floor(sx),y0=Math.floor(sy),x1=Math.min(iw-1,x0+1),y1=Math.min(ih-1,y0+1),fx=sx-x0,fy=sy-y0;
        const a=(y0*iw+x0)*4,b=(y0*iw+x1)*4,c=(y1*iw+x0)*4,d=(y1*iw+x1)*4,index=(y*w+x)*4;
        for(let channel=0;channel<3;channel++)out[index+channel]=(source[a+channel]*(1-fx)+source[b+channel]*fx)*(1-fy)+(source[c+channel]*(1-fx)+source[d+channel]*fx)*fy;
        out[index+3]=255;
      }
    }
    return {width:w,height:h,data:out};
  }
  function enhance(image, mode='readable') {
    checkImage(image);if(!['readable','mono'].includes(mode))throw new Error('Traitement inconnu');
    const {width:w,height:h,data}=image,gray=grayscale(image);
    const tile=Math.max(24,Math.round(Math.min(w,h)/10)),gw=Math.ceil(w/tile),gh=Math.ceil(h/tile),background=new Float32Array(gw*gh);
    for(let gy=0;gy<gh;gy++)for(let gx=0;gx<gw;gx++){
      const hist=new Uint32Array(256);let count=0;
      for(let y=gy*tile;y<Math.min(h,(gy+1)*tile);y+=2)for(let x=gx*tile;x<Math.min(w,(gx+1)*tile);x+=2){hist[Math.round(gray[y*w+x])]++;count++;}
      background[gy*gw+gx]=Math.max(45,percentile(hist,count,.88));
    }
    const corrected=new Float32Array(w*h),contrast=mode==='mono'?1.6:1.3;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const px=clamp(x/tile-.5,0,gw-1),py=clamp(y/tile-.5,0,gh-1),x0=Math.floor(px),y0=Math.floor(py),x1=Math.min(gw-1,x0+1),y1=Math.min(gh-1,y0+1),fx=px-x0,fy=py-y0;
      const bg=(background[y0*gw+x0]*(1-fx)+background[y0*gw+x1]*fx)*(1-fy)+(background[y1*gw+x0]*(1-fx)+background[y1*gw+x1]*fx)*fy;
      const normalized=gray[y*w+x]*245/bg;
      corrected[y*w+x]=clamp(250-(250-normalized)*contrast,0,255);
    }
    const out=new Uint8ClampedArray(data.length);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=y*w+x,v=corrected[i];let sharpen=0;
      if(x>0&&y>0&&x<w-1&&y<h-1){const delta=v-(corrected[i-1]+corrected[i+1]+corrected[i-w]+corrected[i+w])/4;if(Math.abs(delta)>2)sharpen=clamp(delta*.28,-10,10);}
      const target=clamp(v+sharpen,0,255);
      for(let c=0;c<3;c++)out[i*4+c]=mode==='mono'?target:target+(data[i*4+c]-gray[i])*.9;
      out[i*4+3]=255;
    }
    return {width:w,height:h,data:out};
  }
  return {fullFrame,validQuad,rotateQuad,area,detect,rectify,enhance};
});
