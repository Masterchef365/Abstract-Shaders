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

    bool b = true;
    float v = 0.;
    for (int i = 0; i < 14; i++) {
        b = b != fract((st.x + st.y) * float(i)) < 0.5;
        b = b != fract((-st.x + st.y) * float(i)) < 0.5;//(cos(u_time / 2.) + 1.) / 2.;
        v += 0.722 * float(b);
        //color += float(b) * vec3(0.276,0.980,0.877) * 0.122;
    }
    vec3 color = mix(vec3(0.945,0.980,0.288), vec3(0.036,0.825,0.283), v);
    //color = vec3(b);

    gl_FragColor = vec4(color,1.0);
}
