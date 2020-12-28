// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool ur_stripes(vec2 st) {
    return st.x * -0.5 + fract(st.y * 5.976) > cos(u_time) * .5;
}

bool spikes(vec2 st) {
    return ur_stripes(st.yx) != ur_stripes(st);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    color = vec3(spikes(st), spikes(st + .1), spikes(st + .02));

    gl_FragColor = vec4(color,1.0);
}
