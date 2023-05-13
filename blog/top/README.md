<template>
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#">
<meta property="og:title" content="Renard's Blog" />
<meta property="og:description" content="" />
<link rel="icon" href="favicon.ico">
</head>
<canvas id="canvas"></canvas>
</template>

<style lang="stylus">
canvas
{
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 100% !important;
    height: 100% !important;
    z-index: -1 !important;
}
</style>

<script>
export default {
  mounted() {
    onLoad();
  }
}

// global
var screenWidth, screenHeight;
var c, cw, ch, mx, my, gl;
var startTime;
var time = 0.0;
var fps = 1000 / 60;
var uniLocation = new Array();
const vs_source = `
attribute vec3 position;

void main(void){
    gl_Position = vec4(position, 1.0);
}
`;
const fs_source = `
precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float localTime;
float absLocalTime;
#define remap(x,a,b,c,d) (((x-a)/(b-a))*(d-c)+c)
#define remapc(x,a,b,c,d) clamp(remap(x,a,b,c,d),min(c,d),max(c,d))
#define pal(a,b,c,d,e) ((a) + (b)*sin((c)*(d) + (e)))
#define PI 3.1415926535897932384626433832795


// Hash without Sine by David Hoskins.
// https://www.shadertoy.com/view/4djSRW
float hash11(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash23(vec3 p3)
{
    p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

float noise11(float x)
{
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash11(i), hash11(i + 1.0), u);
}

// https://www.shadertoy.com/view/Mt2GWD
#define MAX_INT_DIGITS 5
#define CHAR_SIZE vec2(8, 12)
#define CHAR_SPACING vec2(8, 12)
#define STRWIDTH(c) (c * CHAR_SPACING.x)
#define STRHEIGHT(c) (c * CHAR_SPACING.y)

#define ch_spc vec4(0x000000, 0x000000, 0x000000, 0x000000)
#define ch_per vec4(0x000000, 0x000000, 0x000038, 0x380000)
#define ch_0 vec4(0x007CC6, 0xD6D6D6, 0xD6D6C6, 0x7C0000)
#define ch_1 vec4(0x001030, 0xF03030, 0x303030, 0xFC0000)
#define ch_2 vec4(0x0078CC, 0xCC0C18, 0x3060CC, 0xFC0000)
#define ch_3 vec4(0x0078CC, 0x0C0C38, 0x0C0CCC, 0x780000)
#define ch_4 vec4(0x000C1C, 0x3C6CCC, 0xFE0C0C, 0x1E0000)
#define ch_5 vec4(0x00FCC0, 0xC0C0F8, 0x0C0CCC, 0x780000)
#define ch_6 vec4(0x003860, 0xC0C0F8, 0xCCCCCC, 0x780000)
#define ch_7 vec4(0x00FEC6, 0xC6060C, 0x183030, 0x300000)
#define ch_8 vec4(0x0078CC, 0xCCEC78, 0xDCCCCC, 0x780000)
#define ch_9 vec4(0x0078CC, 0xCCCC7C, 0x181830, 0x700000)
#define ch_col vec4(0x000000, 0x383800, 0x003838, 0x000000)
#define ch_A vec4(0x003078, 0xCCCCCC, 0xFCCCCC, 0xCC0000)
#define ch_C vec4(0x003C66, 0xC6C0C0, 0xC0C666, 0x3C0000)
#define ch_E vec4(0x00FE62, 0x60647C, 0x646062, 0xFE0000)
#define ch_L vec4(0x00F060, 0x606060, 0x626666, 0xFE0000)
#define ch_O vec4(0x00386C, 0xC6C6C6, 0xC6C66C, 0x380000)
#define ch_P vec4(0x00FC66, 0x66667C, 0x606060, 0xF00000)
#define ch_R vec4(0x00FC66, 0x66667C, 0x6C6666, 0xE60000)
#define ch_Y vec4(0x00CCCC, 0xCCCC78, 0x303030, 0x780000)

vec2 res = vec2(0);
vec2 print_pos = vec2(0);
//Extracts bit b from the given number.
//Shifts bits right (num / 2^bit) then ANDs the result with 1 (mod(result,2.0)).
float extract_bit(float n, float b)
{
    b = clamp(b, -1.0, 24.0);
    return floor(mod(floor(n / pow(2.0, floor(b))), 2.0));
}
//Returns the pixel at uv in the given bit-packed sprite.
float sprite(vec4 spr, vec2 size, vec2 uv)
{
    uv = floor(uv);

    //Calculate the bit to extract (x + y * width) (flipped on x-axis)
    float bit = (size.x - uv.x - 1.0) + uv.y * size.x;

    //Clipping bound to remove garbage outside the sprite's boundaries.
    bool bounds = all(greaterThanEqual(uv, vec2(0))) && all(lessThan(uv, size));

    float pixels = 0.0;
    pixels += extract_bit(spr.x, bit - 72.0);
    pixels += extract_bit(spr.y, bit - 48.0);
    pixels += extract_bit(spr.z, bit - 24.0);
    pixels += extract_bit(spr.w, bit - 0.0);

    return bounds ? pixels : 0.0;
}

#define NORMAL 0
#define INVERT 1
#define UNDERLINE 2
int TEXT_MODE = NORMAL;

//Prints a character and moves the print position forward by 1 character width.
float char(vec4 ch, vec2 uv)
{
    if(TEXT_MODE == INVERT)
    {
      //Inverts all of the bits in the character.
        ch = pow(2.0, 24.0) - 1.0 - ch;
    }
    if(TEXT_MODE == UNDERLINE)
    {
      //Makes the bottom 8 bits all 1.
      //Shifts the bottom chunk right 8 bits to drop the lowest 8 bits,
      //then shifts it left 8 bits and adds 255 (binary 11111111).
        ch.w = floor(ch.w / 256.0) * 256.0 + 255.0;
    }
    float px = sprite(ch, CHAR_SIZE, uv - print_pos);
    print_pos.x += CHAR_SPACING.x;
    return px;
}

//Returns the digit sprite for the given number.
vec4 get_digit(float d)
{
    int i = int(clamp(d,0.0,9.99));
    if(i==0)
        return ch_0;
    if(i==1)
        return ch_1;
    if(i==2)
        return ch_2;
    if(i==3)
        return ch_3;
    if(i==4)
        return ch_4;
    if(i==5)
        return ch_5;
    if(i==6)
        return ch_6;
    if(i==7)
        return ch_7;
    if(i==8)
        return ch_8;
    if(i==9)
        return ch_9;
    return ch_0;
}
float print_integer(float number, int zeros, vec2 uv)
{
    float result = 0.0;

    for(int i = MAX_INT_DIGITS; i >= 0; i--)
    {
        float digit = mod(number / pow(10.0, float(i)), 10.0);

        if(abs(number) > pow(10.0, float(i)) || zeros > i || i == 0) //Clip off leading zeros.
        {
            result += char(get_digit(digit), uv);
        }
    }
    return result;
}
vec2 rot2d(vec2 v, float a)
{
    return vec2(v.x * cos(a) - v.y * sin(a), v.x * sin(a) + v.y * cos(a));
}
mat3 getOrthogonalBasis( vec3 z ) {
 z = normalize( z );
 vec3 up = abs( z.y ) < 0.99 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 0.0, 0.0, 1.0 );
 vec3 x = normalize( cross( up, z ) );
 return mat3( x, cross( z, x ), z );
}
vec3 cyclicNoise( vec3 p, float pump ) {
 vec4 sum = vec4( 0.0 );
 mat3 basis = getOrthogonalBasis( vec3( -1.0, 2.0, -3.0 ) );
 for ( int i = 0; i < 10; i ++ ) {
   p *= basis;
   p += sin( p.yzx );
   sum += vec4(
     cross( cos( p ), sin( p.zxy ) ),
     1.0
   );
   sum *= pump;
   p *= 2.0;
 }
 return clamp(sum.xyz / sum.w,0.0,1.0);
}
float ease(float t,float p)
{
  float lf = floor(t);
  float lr = fract(t);
  lr = pow(smoothstep(0.0,1.0,lr),p);
  return lf+lr;
}
vec3 getCol(vec2 p,float ts)
{
  vec3 col;
  vec3 seed = vec3(p*5.0+mouse*2.5,localTime*0.25-ts*0.5);
  vec3 n = cyclicNoise(seed,2.0);
  float freq = 1.0;
  float amp = dot(n,vec3(1));
  float map = remapc(amp,0.4,0.6,0.0,1.0);
  col = vec3(map);
  // bar
  vec2 uv = gl_FragCoord.xy/resolution;
  uv = uv*2.0-1.0;
  uv *= vec2(1.4,2.0);
  uv = (uv+1.0)*0.5;
  vec2 buv = p*10.0 + vec2(0,localTime*0.5-ts*0.25)*(uv.x<0.5?1.0:-1.0);
  float thr = 0.05*resolution.y/resolution.x;
  col = fract(buv.x+buv.y)<0.5&&((0.0<uv.x&&uv.x<thr)||(1.0-thr<uv.x&&uv.x<1.0))&&(0.0<uv.y&&uv.y<1.0)?(1.0-col):col;
  // waku
  uv = gl_FragCoord.xy/resolution;
  uv = abs(uv*2.0-1.0);
  vec2 thr2 = 0.02*vec2(resolution.y/resolution.x,1.0);
  vec2 off2 = 0.1*vec2(resolution.y/resolution.x,1.0);
  vec2 waku = vec2(0.85,0.7);
  col = ((waku.x<uv.x&&uv.x<waku.x+thr2.x)||(waku.y<uv.y&&uv.y<waku.y+thr2.y))&&(waku.x-off2.x<uv.x&&uv.x<waku.x+thr2.x)&&(waku.y-off2.y<uv.y&&uv.y<waku.y+thr2.y)?vec3(1.0-col):col;
  // quad
  uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float qlt = mod(absLocalTime+2.5,4.0);
  float qlt0 = ease(remapc(qlt,0.0,2.0,0.0,1.0),0.2);
  float qlt1 = ease(remapc(qlt,0.5,2.5,0.0,1.0),0.2);
  float qlt2 = ease(remapc(qlt,1.0,3.0,0.0,1.0),0.2);
  float qlt3 = ease(remapc(qlt,2.5,4.0,0.0,1.0),0.2);
  uv = rot2d(uv, -qlt3 * 2.0 * PI);
  vec2 uv0 = abs(rot2d(uv, qlt0 * 0.5 * PI));
  vec2 uv1 = abs(rot2d(uv, qlt1 * 0.5 * PI));
  vec2 uv2 = abs(rot2d(uv, qlt2 * 0.5 * PI));
  vec2 qu2 = vec2(0.01);
  vec2 quoff0 = vec2(0.3),quoff1 = vec2(0.32),quoff2 = vec2(0.34);
  col = any(lessThan(quoff0,uv0))&&all(lessThan(uv0,quoff0+qu2))?vec3(1.0-col):col;
  col = any(lessThan(quoff1,uv1))&&all(lessThan(uv1,quoff1+qu2))?vec3(1.0-col):col;
  col = any(lessThan(quoff2,uv2))&&all(lessThan(uv2,quoff2+qu2))?vec3(1.0-col):col;
  // time
  TEXT_MODE = INVERT;
  float timer = 0.0;
  float ism = min(resolution.x,resolution.y);
  float dcc = remapc(ism,420.,1080.,1.5,3.);
  vec2 cent = 0.5*resolution.xy/dcc;
  vec2 iuv = gl_FragCoord.xy/dcc;
  float t = absLocalTime;
  float hour = floor(t / 60.0 / 60.0);
  float minute = floor(mod(t / 60.0, 60.0));
  float sec = floor(mod(t, 60.0));
  print_pos = floor(cent - vec2(STRWIDTH(4.0), STRHEIGHT(0.5)));
  timer += print_integer(hour, 2, iuv);
  timer += char(ch_col, iuv);
  timer += print_integer(minute, 2, iuv);
  timer += char(ch_col, iuv);
  timer += print_integer(sec, 2, iuv);
  col = timer>0.0?vec3((1.0-col)):col;
  return col;
}
vec3 getShiftedCol(vec2 p,vec2 os)
{
  vec3 col;
  float cr,cg,cb;
  vec2 osd = normalize(os);
  float osl = length(os);
  float ts = pow(remapc(osl,0.0,1.0,1.0,0.0),5.0)*7.0;
  osl = remapc(osl,0.0,1.0,0.01,0.0);
  os = osd*osl;

  float qlt = mod(absLocalTime,4.0);
  float amp = ease(remapc(qlt,0.0,4.0,0.0,1.0),4.0)*0.03;
  float se = floor(p.y*25.0);
  os = vec2(hash11(se)*amp,0.0);

  cr = getCol(p+os,ts).r;
  cg = getCol(p,ts).g;
  cb = getCol(p-os,ts).b;
  col = vec3(cr,cg,cb);
  return col;
}

void main(void){
  localTime = time;
  float ltime = 4.0;
  localTime /= ltime;
  localTime = ease(localTime,0.2);
  localTime *= ltime;
  localTime *= 2.0;
  absLocalTime = time;
  vec3 col;
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy/resolution;
  vec2 os = (uv-mouse);
  if(resolution.x<resolution.y) 
  {
    os.y *= resolution.y/resolution.x;
  }
  else
  {
    os.x *= resolution.x/resolution.y;
  }
  col = getShiftedCol(p,os);
  col *= 1.0 - 0.5 * pow(remapc(length(uv - 0.5), 0.0, 0.5, 0.0, 1.0), 5.0);
  gl_FragColor = vec4(col,1.0);
}
`;

// レンダリングを行う関数
function render(){    
    // 時間管理
    time = (new Date().getTime() - startTime) * 0.001;

    // カラーバッファをクリア
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // uniform 関連
    gl.uniform1f(uniLocation[0], time);
    gl.uniform2fv(uniLocation[1], [mx, my]);
    gl.uniform2fv(uniLocation[2], [cw, ch]);
    
    // 描画
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();
    
    // 再帰
    setTimeout(render, fps);
}

// mouse
function mouseMove(e){
    mx = e.clientX / cw;
    my = (ch - e.clientY) / ch;
}

// resolution
function setResolution()
{
    screenWidth = window.innerWidth || document.documentElement.clientWidth;
    screenHeight = window.innerHeight || document.documentElement.clientHeight;
    cw = c.width = screenWidth;
    ch = c.height = screenHeight;
    gl.viewport(0, 0, cw, ch);
}

// onload
function onLoad()
{
    // イベントリスナー登録
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('resize', setResolution);

    // canvas エレメントを取得
    c = document.getElementById('canvas');

    // WebGL コンテキストを取得
    gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // canvas
    setResolution();

    // イベントリスナー登録
    // c.addEventListener('mousemove', mouseMove);

    // シェーダ周りの初期化
    var prg = create_program(create_shader(gl.VERTEX_SHADER,vs_source), create_shader(gl.FRAGMENT_SHADER,fs_source));
    uniLocation[0] = gl.getUniformLocation(prg, 'time');
    uniLocation[1] = gl.getUniformLocation(prg, 'mouse');
    uniLocation[2] = gl.getUniformLocation(prg, 'resolution');
    
    // 頂点データ回りの初期化
    var position = [
        -1.0,  1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    var index = [
        0, 2, 1,
        1, 2, 3
    ];
    var vPosition = create_vbo(position);
    var vIndex = create_ibo(index);
    var vAttLocation = gl.getAttribLocation(prg, 'position');
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
    gl.enableVertexAttribArray(vAttLocation);
    gl.vertexAttribPointer(vAttLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);
    
    // その他の初期化
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    mx = 0.5; my = 0.5;
    startTime = new Date().getTime();
    
    // レンダリング関数呼出
    render();
}

// シェーダを生成する関数
function create_shader(type,source){
	// シェーダを格納する変数
	var shader = gl.createShader(type);
	
	// 生成されたシェーダにソースを割り当てる
	gl.shaderSource(shader, source);
	
	// シェーダをコンパイルする
	gl.compileShader(shader);
	
	// シェーダが正しくコンパイルされたかチェック
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		
		// 成功していたらシェーダを返して終了
		return shader;
	}else{
		
		// 失敗していたらエラーログをアラートしコンソールに出力
		alert(gl.getShaderInfoLog(shader));
		console.log(gl.getShaderInfoLog(shader));
	}
}

// プログラムオブジェクトを生成しシェーダをリンクする関数
function create_program(vs, fs){
	// プログラムオブジェクトの生成
	var program = gl.createProgram();
	
	// プログラムオブジェクトにシェーダを割り当てる
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	
	// シェーダをリンク
	gl.linkProgram(program);
	
	// シェーダのリンクが正しく行なわれたかチェック
	if(gl.getProgramParameter(program, gl.LINK_STATUS)){
	
		// 成功していたらプログラムオブジェクトを有効にする
		gl.useProgram(program);
		
		// プログラムオブジェクトを返して終了
		return program;
	}else{
		
		// 失敗していたら NULL を返す
		return null;
	}
}

// VBOを生成する関数
function create_vbo(data){
	// バッファオブジェクトの生成
	var vbo = gl.createBuffer();
	
	// バッファをバインドする
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	
	// バッファにデータをセット
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	// バッファのバインドを無効化
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	// 生成した VBO を返して終了
	return vbo;
}

// IBOを生成する関数
function create_ibo(data){
	// バッファオブジェクトの生成
	var ibo = gl.createBuffer();
	
	// バッファをバインドする
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	
	// バッファにデータをセット
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
	
	// バッファのバインドを無効化
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	// 生成したIBOを返して終了
	return ibo;
}
</script>
