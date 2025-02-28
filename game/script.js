
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const start=document.getElementById('start');
const show_protect_time=document.getElementById('protect-time');
const white_weight=document.getElementById('weight-length');
const g=0.05;
var second=0,minute=0;
var settime,timelen;
start.addEventListener('click',function(){
    const temp=String(minute).padStart(2,'0')+':'+String(second).padStart(2,'0');
    document.getElementById('text1').innerHTML=temp;
    const settime1=setInterval(give, 100);
    const timelenth=setInterval(memortime,1000);
    settime=settime1;
    timelen=timelenth;
},{once:true});
var juge=1;
var protect_time=0;
let centry = {
    x:400,
    y:575,
    size: 25,
    speed: 5,
    color: 'tan'
};
let protectcircle={
    x:centry.x,
    y:centry.y,
    r:centry.size+20,
    color:'rgba(140, 253, 255, 0.5)'
}
//给小球样式
let eats=[];
function give(){
    //id为1为普通球，1以上为技能球
    if(Math.random()>0.05){
        eats.push({
            x:Math.random()*800,
            y:0,
            vy:Math.random()+2+1,
            vx:0,
            size:3,
            color:'rgb(255, 187, 1)',
            id:1
        });
    }
    else{
        eats.push({
            x:Math.random()*800,
            y:0,
            vy:Math.random(),
            vx:0,
            size:6,
            color:'blue',
            id:2
        });
    }
};


  
//存储游戏进行的时间
function memortime(){
    const temp=String(minute).padStart(2,'0')+':'+String(second).padStart(2,'0');
    document.getElementById('text1').innerHTML=temp;
    second++;
    if(second==59){
        minute++;
        second=0;
    }
};


//键盘监视
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    a:false
};
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});
function update() {
    if (keys.ArrowUp && centry.y- centry.size> 0) {
        centry.y-=centry.speed;
    }
    if (keys.ArrowDown && centry.y + centry.size < canvas.height) {
        centry.y+=centry.speed;
    }
    if (keys.ArrowLeft && centry.x- centry.size > 0) {
        centry.x-=centry.speed;
    }
    if (keys.ArrowRight && centry.x + centry.size < canvas.width) {
        centry.x+=centry.speed;
    }
}


function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = centry.color;
        ctx.beginPath();
        ctx.arc(centry.x, centry.y, centry.size, 0, Math.PI*2);
        ctx.fill(); 
        ctx.fillText('白何乐',centry.x,centry.y-centry.size);
        ctx.textAlign='center';
    eats.forEach((eat,index) => {
        ctx.fillStyle = eat.color;
        ctx.beginPath();
        ctx.arc(eat.x, eat.y, eat.size, 0, Math.PI*2);
        ctx.fill(); 
    });
    if(protect_time>0){
        //绘画保护罩
        ctx.fillStyle = protectcircle.color;
        ctx.beginPath();
        ctx.arc(centry.x, centry.y,protectcircle.r, 0, Math.PI*2);
        ctx.fill(); 
    }
}
//整体动画
function gameLoop() {
    update();
    draw();
    eats.forEach((eat,index) => {
        eat.y+=eat.vy;
        eat.x+=eat.vx;
        eat.vy+=g;
        //吃豆机制
        if(Math.abs(eat.x-centry.x)<centry.size&&Math.abs(eat.y-centry.y)<centry.size&&centry.speed){
            if(eat.id==1){
                eats[index]={};
                centry.size+=7.5;
                centry.speed-=0.4;
            }
            else if(eat.id==2){
                eats[index]={};
                protect_time+=1000;
            }
        }
        if(protect_time>0){
            //保护罩碰撞机制
            if(Math.abs(eat.x-centry.x)<protectcircle.r&&Math.abs(eat.y-centry.y)<protectcircle.r){
                const a=centry.x-eat.x;
                const b=centry.y-eat.y;
                const l=Math.sqrt(a*a+b*b);
                const v=eat.vx*a/l+eat.vy*b/l;
                if(v>0){
                    eat.vx=-v*a/l;
                    eat.vy=-v*b/l;
                }
            }
        }
        //防止速度为负反着走
        if(centry.speed<0){
            centry.speed=0;
        }
    });
    //胖的走不动路了，游戏结束
    if(centry.speed<=0.1&&juge) {
        setTimeout(() => {
            alert('白何乐吃的走不动了！');
        },2000);
        juge=0;
        eats.length=0;
        clearInterval(settime);
        clearInterval(timelen);
    }
    requestAnimationFrame(gameLoop);
}
//数值刷新
setInterval(()=>{
    const weightlenth=(5-centry.speed)*20+'%';
    const length=protect_time/10+'%';
    white_weight.style.width=weightlenth;
    show_protect_time.style.width=length;
    protectcircle.r=centry.size+20;
    if(protect_time>0)protect_time--;
},1);
gameLoop();