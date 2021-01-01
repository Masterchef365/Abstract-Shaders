// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec3 color = vec3(0.);
    bool b = true;
    for (int i = 0; i < 9; i++) {
        b = b != fract((st.x + st.y) * float(i)) < .5;
        b = b != fract((-st.x + st.y) * float(i)) < .5;//(cos(u_time / 2.) + 1.) / 2.;
    }
    color = vec3(b);

    gl_FragColor = vec4(color,1.0);
}
