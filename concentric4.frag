// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float cells = 16.;
const float rings = 8.;

bool bonk(ivec2 cell, float x) {
    return cos(length(vec2((cell)) * rings) / rings) < cos(x);
}

bool fonk(ivec2 cell, float pitch) {
    bool a = bonk(cell, -2.064);
    bool b = bonk(cell, u_time / pitch);
    return a != b;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2. - 1.;;

    vec3 color = vec3(0.);
    
    ivec2 cell = ivec2(st * cells);
    
    color = vec3(
        (float(fonk(cell, 2.496)) + float(fonk(cell, 2.496))) / 2.,
		(float(fonk(cell, 2.280)) + float(fonk(cell, 2.560))) / 2.,
        (float(fonk(cell, 2.360)) + float(fonk(cell, 2.664))) / 2.
    );

    gl_FragColor = vec4(color,1.0);
}
