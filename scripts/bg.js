var vs = `
attribute vec4 position;

varying vec2 vecPos;

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

varying vec2 vecPos;

vec3 hueShift(vec3 color, float hue)
{
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

void main() {
    vec2 img = vec2(960.0,1440.0);

    float factor = screen_res.x / canvas_res.x;
    vec2 pixel = vec2(
        gl_FragCoord.x * factor,
        (canvas_res.y - gl_FragCoord.y) *  factor
    );
    vec2 uv =  pixel.xy / screen_res * 2.;
    uv.y /= 2.65; //correcting the aspect ratio

    float wonkiness = max(min(time/5.,1.),0.);
    uv.x += mix(0.,sin(time *0.5 + gl_FragCoord.y*0.005)* 0.01,wonkiness);


    float dim = (255.0-170.0)/255.0;
    vec3 color = texture2D(tex,uv.xy).xyz;

    gl_FragColor = vec4(
        mix(
            color,
            hueShift(color,(gl_FragCoord.y/50.+ 1.*time))
            ,wonkiness
            ),1) * vec4(dim,dim,dim,1);

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
const background = twgl.createTexture(gl, {
    src: "/background.jpeg"
});

function render(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        time: time / 1000.0,
        screen_res: [window.screen.width, window.screen.height],
        canvas_res: [gl.canvas.width, gl.canvas.height],
        tex: background
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);