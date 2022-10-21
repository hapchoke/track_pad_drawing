//  キーが押されているかどうかのフラグ
let key_down_flag = false;
// クリックされているかどうかのフラグ
let is_push_draw = false;
// 描画開始時のマウスの位置
let lastPosition = { x: null, y: null };
// 描く時用の主要キー
let key = 'Shift';
// 太さの初期値　変数
let thickness_slider_x=6;
// スライダーの初期　x座標
let inti_slider_color_x = 170;
// どこからでも参照可能な　色選択スライダーの一意な値 16進数
let slider_now_16_color;
let selected_palette = 1;
// カラーピッカーの現在地　と初期値
let color_picker_now_xy = [250,200];


let canvas;
let context;
// お絵描きcanvasの作成とサイズ取得
function inti_canvas(width=800,height=600){
    // ここでcanvas要素作成
    const canvas_area = document.querySelector('.canvas-area');
    canvas_area.innerHTML = "<canvas id='draw-area' width='"+width+"' height='"+height+"'></canvas>";
    // canvas要素のcontextの取得
    canvas = document.querySelector('#draw-area');
    canvas.style.border="1px solid black"
    context = canvas.getContext('2d');
    // 背景は白
    context.fillStyle='#ffffff';
    context.fillRect(0,0,canvas.width,canvas.height);
    // 現在のサイズ取得し表示
    const now_size = document.querySelector(".now-size");
    now_size.innerHTML="現在のサイズ<br>"+"width:"+canvas.width+"px<br>height:"+canvas.height+"px";
    inti_canvas_event();
}
inti_canvas();


// canvasに紐づく　描画用イベント登録関数
function inti_canvas_event(){
    canvas.addEventListener('mousemove',(e)=>{
        draw(e.offsetX, e.offsetY);
    });
    // canvas要素からでたら　過去のマウス位置は初期化　そして一度パスを閉じる
    canvas.addEventListener('mouseout',(e)=>{
        if(key_down_flag||is_push_draw){
            context.closePath();
            lastPosition = { x: null, y: null };
            context.beginPath();
        }
    });
}
// 描画開始時と描画中に使われる
function draw(x,y){
    // フラグの確認
    if(key_down_flag!=true&&is_push_draw!=true){
        return;
    }
    // 線の状態
    context.lineCap = 'round'; // 丸みを帯びた線にする
    context.lineJoin = 'round'; // 丸みを帯びた線にする
    context.lineWidth = thickness_slider_x; // 線の太さ
    context.strokeStyle = color_arr[selected_palette-1];
    if (lastPosition.x === null || lastPosition.y === null) {
        // 線の開始位置
        context.moveTo(x, y);
    } else {
        // ドラッグ中の線の開始位置
        context.moveTo(lastPosition.x, lastPosition.y);
    }
    // 現在の点位置へ
    context.lineTo(x, y);
    context.stroke();
    // マウス位置を記録
    lastPosition.x = x;
    lastPosition.y = y;
}


// 連続でイベントが発火しないように回数を管理
let times = 0;
// キーを判定して、フラグ立てて、パスの開始
window.addEventListener("keydown",(e)=>{
    if (e.key==key&&times==0){
        key_down_flag = true;
        times=1;
        context.beginPath();
    }
});
window.addEventListener("keyup",(e)=>{
    if (e.key==key){
        key_down_flag = false;
        context.closePath();
        lastPosition = { x: null, y: null };
        times=0;
    }
});
// マウスをクリックしながら押す場合
window.addEventListener("mousedown",(e)=>{
    if (times==0){
        is_push_draw = true;
        times=1;
        context.beginPath();
    }
});
window.addEventListener("mouseup",(e)=>{
        is_push_draw = false;
        context.closePath();
        lastPosition = { x: null, y: null };
        times=0;
});

// サイズ変更
const canvas_change = document.querySelector(".size-change");
canvas_change.addEventListener('click',()=>{
    const width = document.querySelector('.change-width');
    const height = document.querySelector('.change-height');
    if(width.value&&height.value){
        inti_canvas(width.value,height.value);
    }
});

// キーの変更　　
const change_key = document.querySelector('.key-change');
change_key.addEventListener('keydown',(e)=>{
    if(e.key.length==1){
        if(e.key==" "){
            // スペースの場合
            change_key.value="Space";
        }else{
            // 一文字系の場合
            change_key.value="";
        }
    }else{
        // shiftとか
        change_key.value = e.key;
    }
    key = e.key;
    display_now_key();
});
// 現在のキーを表示
function display_now_key(){
    let now_key = document.querySelector('.now-key');
    now_key.innerHTML = "現在のkey:"+key;
}
display_now_key();

// 初期化イベント登録　イベント常に共通
const button = document.querySelector(".clear-button");
button.addEventListener('click',clear);
// 消す時の処理
function clear(){
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle='#ffffff';
    context.fillRect(0,0,canvas.width,canvas.height);
}

// ダウンロード
const download_button = document.querySelector('.download-button');
download_button.addEventListener('click',()=>{
    let a = document.createElement('a');
	//canvasをpng変換し、そのBase64文字列をhrefへセット
	a.href = canvas.toDataURL('image/png', 1);
	a.download = 'pad_draw.png';
	a.click();
});



// 線の太さcanvas　関係
//三角形 部分
const thickness_triangle_canvas = document.querySelector('#thickness-triangle');
const thickness_triangle_context = thickness_triangle_canvas.getContext('2d');
thickness_triangle_canvas.style.border="1px solid black"
thickness_triangle_context.beginPath();
thickness_triangle_context.moveTo(3,10);
thickness_triangle_context.lineTo(107,5); 
thickness_triangle_context.lineTo(107,15);
thickness_triangle_context.closePath();
thickness_triangle_context.stroke();
thickness_triangle_context.fillStyle = "black";
thickness_triangle_context.fill();
//スライド　部分
const thickness_current_canvas = document.querySelector('#thickness-current');
const thickness_current_context = thickness_current_canvas.getContext('2d');
thickness_current_canvas.style.border="1px solid black"
// 文字表示
const thickness_value = document.querySelector('.thickness-value');
thickness_value.value =  thickness_slider_x;
// 文字入力を反映
thickness_value.addEventListener("change",(e)=>{
    slider(Number(e.target.value)+5);
});
// スライダー初期位置
slider(thickness_slider_x+5);
// スライド　イベント
thickness_triangle_canvas.addEventListener('mousedown',(e)=>{
    slider(e.offsetX);
    // スライド可能に
    document.addEventListener('mousemove',onMouseMove);
    document.addEventListener('mouseup',onMouseUp);
    function onMouseMove(e){
        slider(e.clientX-thickness_triangle_canvas.getBoundingClientRect().left);
    }
    function onMouseUp(){
        document.removeEventListener('mousemove',onMouseMove);
        document.removeEventListener('mouseup',onMouseUp);
    }
});
// スライダー描写
function slider(x){
    if(x<5){
        x=5;
    }else if(x>105){
        x=105;
    }
    // 整数にして、現在の太さ表示　その後スライダー描写
    thickness_slider_x=parseInt(x-5, 10);
    thickness_value.value = thickness_slider_x;
    thickness_current_context.clearRect(0,0,thickness_triangle_canvas.width,thickness_triangle_canvas.height);
    thickness_current_context.beginPath();
    thickness_current_context.moveTo(x-1,2);
    thickness_current_context.lineTo(x+1,2);
    thickness_current_context.lineTo(x+1,18);
    thickness_current_context.lineTo(x-1,18);
    thickness_current_context.closePath();
    thickness_current_context.stroke();
    thickness_current_context.fillStyle = "#c5c5c5";
    thickness_current_context.fill();
}
// ボタンによる太さ調整
const left_adjustment = document.querySelector('.left-adjustment');
const right_adjustment = document.querySelector('.right-adjustment');
// 左　単発
left_adjustment.addEventListener('click',(e)=>{
    slider(thickness_slider_x+4);
})
// インターバルを入れる変数
let timeId;
// 左　連続
left_adjustment.addEventListener('mousedown',(e)=>{
    timeId = setInterval(()=>{
        slider(thickness_slider_x+4);},100);
})
left_adjustment.addEventListener('mouseup',(e)=>{
    clearInterval(timeId);
})
left_adjustment.addEventListener('mouseout',(e)=>{
    clearInterval(timeId);
})
// 右　単発
right_adjustment.addEventListener('click',(e)=>{
    slider(thickness_slider_x+6);
})
// 右　連続
right_adjustment.addEventListener('mousedown',(e)=>{
    timeId = setInterval(()=>{
        slider(thickness_slider_x+6);},100);
})
right_adjustment.addEventListener('mouseup',(e)=>{
    clearInterval(timeId);
})
right_adjustment.addEventListener('mouseout',(e)=>{
    clearInterval(timeId);
})


// 色選択スライダー　　初期位置
const slider_color_canvas = document.querySelector('#color-slider');
const slider_color_context = slider_color_canvas.getContext('2d');
// 初期位置描写
slider_color();
// パレット色情報   参照用
let color_arr = ['#000000','#ffffff','#ffffff','#ffffff','#ffffff'];
// 色選択　スライダー
slider_color_canvas.addEventListener('mousedown',(e)=>{
    // 押した部分の色を設定
    color_arr[selected_palette-1]=slider_color(e.offsetX);
    // 反映　　パレットの16進数がrgbに変換されて、カラーピッカーの値を考慮してパレットが再設定されてから描写までされる
    color_picker_circle(color_picker_now_xy[0],color_picker_now_xy[1]);
    document.addEventListener('mousemove',onMouseMove);
    document.addEventListener('mouseup',onMouseUp);
    function onMouseMove(e){
        // 色の設定と反映　　マウスが画面基準のイベントから直接出せる座標から要素の画面上の座標(一定)を引くことで、canvas要素の外に出ても うまく動く
        color_arr[selected_palette-1]=slider_color(e.clientX-slider_color_canvas.getBoundingClientRect().left);
        color_picker_circle(color_picker_now_xy[0],color_picker_now_xy[1]);
    }
    function onMouseUp(){
        document.removeEventListener('mousemove',onMouseMove);
        document.removeEventListener('mouseup',onMouseUp);
        color_picker_circle(color_picker_now_xy[0],color_picker_now_xy[1]);
    }
});
// スライダーのx座標から現在の選択色(ボタンの色)を出す 
function slider_color(x=inti_slider_color_x){
    if(x<20){
        x=20;
    }else if(x>320){
        x=320;
    }
    // スライダーのボタンの色
    let slider_button_color_16 = slider_x_to_color_16(x);
    slider_color_context.clearRect(0,0,slider_color_canvas.width,slider_color_canvas.height);
    slider_color_context.beginPath();
    slider_color_context.arc( x, 15, 14, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
    slider_color_context.strokeStyle = "black";
    slider_color_context.lineWidth = 2;
    slider_color_context.closePath();
    slider_color_context.stroke();
    slider_color_context.beginPath();
    slider_color_context.arc( x, 15, 12, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
    slider_color_context.strokeStyle = "white";
    slider_color_context.lineWidth = 3;
    slider_color_context.closePath();
    slider_color_context.fillStyle = slider_button_color_16 ;
    slider_color_context.fill() ;
    slider_color_context.stroke();
    return slider_button_color_16;
}
// x座標から16進数の色を求める
function slider_x_to_color_16(x){
    let slider_color_x = (x-20)*1536/(slider_color_canvas.width-40);
    const x_256_divide = (slider_color_x-(slider_color_x%256))/256;
    const divided_x_remain = parseInt(slider_color_x%256, 10);
    let rgb = [0,0,0];
    switch(x_256_divide){
        case 0:
            rgb=[255,0,divided_x_remain];
            break;
        case 1:
            rgb=[255-divided_x_remain,0,255];
            break;
        case 2:
            rgb=[0,divided_x_remain,255];
            break;
        case 3:
            rgb=[0,255,255-divided_x_remain];
            break;
        case 4:
            rgb=[divided_x_remain,255,0];
            break;
        case 5:
            rgb=[255,255-divided_x_remain,0];
            break;
        case 6:
            rgb=[255,0,0];
            break;
    }
    slider_now_16_color="#";
    for(let i=0;i<3;i++){
        slider_now_16_color += ('00'+rgb[i].toString(16)).slice(-2);
    }
    color_picker_background();
    return slider_now_16_color;
}


// パレット類の作成
const palette_1 = document.querySelector('#palette-1');
const palette_context_1 = palette_1.getContext('2d');
const palette_2 = document.querySelector('#palette-2');
const palette_context_2 = palette_2.getContext('2d');
const palette_3 = document.querySelector('#palette-3');
const palette_context_3 = palette_3.getContext('2d');
const palette_4 = document.querySelector('#palette-4');
const palette_context_4 = palette_4.getContext('2d');
const palette_5 = document.querySelector('#palette-5');
const palette_context_5 = palette_5.getContext('2d');
// 円の線引きと色塗り　　色が変化するたびに呼ばれる
function draw_palette_circle(){
    for(let i=1;i<6;i++){
        if(i==selected_palette){
            // 選択されている場合
            (new Function('palette_context_'+i+'.clearRect(0,0,40,40);'+'palette_context_'+i+'.beginPath();palette_context_'+i+'.arc( 20, 20, 18, 0 * Math.PI / 180, 360 * Math.PI / 180, false );palette_context_'+i+'.closePath();palette_context_'+i+'.lineWidth=3;palette_context_'+i+".strokeStyle = 'black';palette_context_"+i+'.stroke();'))();
        }else{
            // その他　少し小さく、枠は細く
            (new Function('palette_context_'+i+'.clearRect(0,0,40,40);'+'palette_context_'+i+'.beginPath();palette_context_'+i+'.arc( 20, 20, 15, 0 * Math.PI / 180, 360 * Math.PI / 180, false );palette_context_'+i+'.closePath();palette_context_'+i+'.lineWidth=1;palette_context_'+i+'.stroke();'))();
        }
        // 色を塗る
        (new Function('palette_context_'+i+".fillStyle = '"+color_arr[i-1]+"';" + 'palette_context_'+i+".fill();"))();
    }
}
draw_palette_circle();
// パレットを選択状態にする　イベント
palette_1.addEventListener('mousedown',(e)=>{
        if(selected_palette!=1){
            selected_palette=1;
            draw_palette_circle();
        }
    });
palette_2.addEventListener('mousedown',(e)=>{
    if(selected_palette!=2){
        selected_palette=2;
        draw_palette_circle();
    }
});
palette_3.addEventListener('mousedown',(e)=>{
    if(selected_palette!=3){
        selected_palette=3;
        draw_palette_circle();
    }
});
palette_4.addEventListener('mousedown',(e)=>{
if(selected_palette!=4){
    selected_palette=4;
    draw_palette_circle();
}
});
palette_5.addEventListener('mousedown',(e)=>{
    if(selected_palette!=5){
        selected_palette=5;
        draw_palette_circle();
    }
});


// カラーピッカー
const color_picker_slider = document.querySelector('#color-picker-slider');
const color_picker_slider_context = color_picker_slider.getContext('2d');
color_picker_slider.style.border = "1px solid black";
// 2次元スライダー
color_picker_slider.addEventListener('mousedown',(e)=>{
    color_picker_circle(e.offsetX,e.offsetY);
    document.addEventListener('mousemove',onMouseMove);
    document.addEventListener('mouseup',onMouseUp)
    function onMouseMove(e){  
        color_picker_circle(e.clientX-color_picker_slider.getBoundingClientRect().left,e.clientY-color_picker_slider.getBoundingClientRect().top);
    }
    function onMouseUp(){
        document.removeEventListener('mousemove',onMouseMove);
        document.removeEventListener('mouseup',onMouseUp);
    }
});
// カラーピッカーの選択座標(丸)表示 　　xyを範囲内に整形
function color_picker_circle(x,y){
    if(x<0){
        x=0;
    }else if(x>color_picker_slider.width){
        x=color_picker_slider.width;
    }
    if(y<0){
        y=0;
    }else if(y>color_picker_slider.height){
        y=color_picker_slider.height;
    }
    // 現在位置を記録　次から参照できるように
    color_picker_now_xy = [x,y];
    // パレットへ反映　xyとselected_paletteにより色が決まり反映される
    let color_16 = color_picker_xy_to_rgb(x,y);
    // カラーピッカーの円を描写
    color_picker_slider_context.clearRect(0,0,color_picker_slider.width,color_picker_slider.height);
    color_picker_slider_context.beginPath();
    color_picker_slider_context.arc( x, y, 5, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
    color_picker_slider_context.strokeStyle = "white";
    color_picker_slider_context.lineWidth = 3;
    color_picker_slider_context.closePath();
    color_picker_slider_context.stroke();
    color_picker_slider_context.fillStyle = color_16;
    color_picker_slider_context.fill();
    color_picker_slider_context.beginPath();
    color_picker_slider_context.arc( x, y, 8, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
    color_picker_slider_context.strokeStyle = "black";
    color_picker_slider_context.lineWidth = 2;
    color_picker_slider_context.closePath();
    color_picker_slider_context.stroke();
}
// 初期表示　　color_picker_now_xy
color_picker_circle(x=color_picker_now_xy[0],y=color_picker_now_xy[1]);
// xyからパレットへ色を出力し、設定　16進数の色を返す
function color_picker_xy_to_rgb(x=color_picker_now_xy[0],y=color_picker_now_xy[1]){
    // 選択されている、パレットの色から出していく
    let rgb;
    // スライダーの色を参照し、16進数を10進数にする
    let r = parseInt(slider_now_16_color.slice(1,3), 16);
    let g = parseInt(slider_now_16_color.slice(3,5), 16);
    let b = parseInt(slider_now_16_color.slice(5,7), 16);
    // xyによって細かく色を変える　　切片固定の水平以下傾き(width)とy軸との交点固定の水平以下の傾き(height) 最大値255最低0 あとは要素の大きさとの割合から算出
    r2 = 255-(255-r)*(x/color_picker_slider.width);
    g2 = 255-(255-g)*(x/color_picker_slider.width);
    b2 = 255-(255-b)*(x/color_picker_slider.width);
    r3 = r2-r2*(y/color_picker_slider.height);
    g3 = g2-g2*(y/color_picker_slider.height);
    b3 = b2-b2*(y/color_picker_slider.height);
    rgb=[r3,g3,b3];
    let color_16 = '#';
    for(let i=0;i<3;i++){
        // 整数にしてから、16進数
        color_16 += ('00'+parseInt(rgb[i], 10).toString(16)).slice(-2);
    }
    // color_arrを変更
    color_arr[selected_palette-1] = color_16;
    // パレットを更新
    draw_palette_circle();
    return color_16;
}
function color_picker_background(){
    const color_picker = document.querySelector('.color-picker');
    color_picker.style.background = 'linear-gradient(to top, black, transparent),linear-gradient(to right, #ffffff,'+ slider_now_16_color+')';
}


// 説明ボタン　開閉
const explanation_button = document.querySelector('.open-explanation');
const modal = document.querySelector('.modal');
const close_modal = document.querySelector('.close-modal');
explanation_button.addEventListener('click',()=>{
    modal.style.display = 'block';
});
close_modal.addEventListener('click',()=>{
    modal.style.display = 'none';
});