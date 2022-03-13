// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 rand3(vec2 co) {
    return vec3(
        rand(co * 83.23),
        rand(co * 292.630),
        rand(co * 183.934)
    );
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 3.;
    
    st.y *= 3./2.;
    
    st.x += floor(mod(floor(st.y), 2.)) * 1.5;
    
    vec2 m = mod(st, 1.);
    vec2 j = floor(st);

    vec3 color = vec3(length(m * 2. - 1.) < 1.308) * rand3(j);
    //color = vec3(m, 0.);

    gl_FragColor = vec4(color,1.0);
}
