// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec3 circ(vec2 st, vec2 pos, float radius, vec3 color) {
    return float(distance(st, pos) < radius) * color;
}

vec3 box(vec2 st, vec2 pos, float side, vec3 color) {
    st -= pos;
    return float(abs(st.x) < side && abs(st.y) < side) * color;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.; st -= 1.;
    st *= 0.420;

    vec3 color = mix(vec3(1.000,0.933,0.842), vec3(0.915,0.854,0.771), rand(st));
    color -= box(st, vec2(0.040,0.280), 0.260, (1. - vec3(1.000,0.069,0.679))) * float(fract(length(st) * 10. + u_time) < 0.868);
    color -= box(st, vec2(-0.180,0.000), 0.212, (1. - vec3(0.519,1.000,0.971))) * float(fract(length(st) * 10. + u_time) < 0.604);
    color -= box(st, vec2(0.140,-0.100), 0.240, (1. - vec3(1.000,0.875,0.526))) * float(fract(length(st) * 10. + u_time) < 0.412);

    gl_FragColor = vec4(color,1.0);
}
