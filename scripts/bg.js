var vs = `
attribute vec4 position;
attribute vec2 uv;

varying vec2 vecPos;
varying vec2 UV;

void main() {
    vecPos = position.xy;
    gl_Position = position;
}
`;
var fs = `
precision mediump float;

uniform vec2 canvas_res;
uniform vec2 screen_res;
uniform float time;
uniform sampler2D tex;
uniform float party;

varying vec2 vecPos;

vec3 hueShift(vec3 color, float hue)
{
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {
    vec2 uv = (vecPos+vec2(1,1))/2.;
    uv.y = 1.-uv.y;
    //vec2 uv = vec2(gl_FragCoord.x, canvas_res.y - gl_FragCoord.y) / screen_res;

    float wonkiness = max(min(party * time/5.,1.),0.) * party;
    uv.x += mix(0.
        ,sin(party *time *0.5 + uv.y*1.5)* 0.01,wonkiness)/2.;
    uv.y += mix(0.
        ,cos(party * time *0.5 + uv.x*5.)* 0.01,wonkiness)/2.;

    float dim = (255.0-170.0)/255.0;
    vec3 color = texture2D(tex,uv.xy).xyz;

    vec4 color2 = vec4(texture2D(tex,uv.xy).xyz/4.,1);

    gl_FragColor = mix(vec4(
        mix(
            color,
            hueShift(color,(vecPos.y+ 1.*time))
            ,wonkiness-0.5
            ),1) * vec4(dim,dim,dim,1),  color2,0.5);

}
    `;
const gl = document.getElementById("background").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

const arrays = {
    position: [
        -1, -1, 0,
        1, -1, 0,
        -1, 1, 0,
        -1, 1, 0,
        1, -1, 0,
        1, 1, 0
    ],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
const bgs = [
    "art1.jpg",
    "art2.jpg",
    "art3.jpg",
    "art4.jpg",
    "art5.jpg",
    "art6.jpg",
    "art7.jpg",
    "smbr1.jpg",
    "smbr2.jpg",
    "smbr3.jpg",
    "smbr4.jpg",
];
const randomBG = bgs[Math.floor(Math.random()*bgs.length)]
//const cursedBG = "smbr3.jpg"
//const putCurse = document.URL.includes("monkeydiet")
//let bg = putCurse ? cursedBG : randomBG
const background = twgl.createTexture(gl, {
    src: "/backgrounds/" + randomBG
});
var bg_party_mode = 1;
function render(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        time: time / 1000.0,
        screen_res: [window.screen.width, window.screen.height],
        canvas_res: [gl.canvas.width, gl.canvas.height],
        tex: background,
        party: bg_party_mode
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render,gl.canvas);
}
requestAnimationFrame(render,gl.canvas);