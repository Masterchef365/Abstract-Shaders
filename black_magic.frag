// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
const float PI = 3.141592;
const float TAU = PI * 2.;

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.;
    st -= 1.;

    vec3 color = vec3(0.);
    float angle = (atan(st.y, st.x) + PI) / TAU;
    float quant_angle = float(int(angle * 99.816));
    float outward = float(int(cos(length(st) - u_time) * 10.));
    float r = rand(vec2(quant_angle, outward));
    color = mix(
        mix(vec3(0.619,0.200,1.000), vec3(1.000,0.141,0.354), r * 2.), vec3(1.), r);

    gl_FragColor = vec4(color,1.0);
}
