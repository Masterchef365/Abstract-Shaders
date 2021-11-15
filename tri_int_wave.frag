// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

int tri_int_wave(float x, float size) {
    return int(floor(abs(fract(x) - .5) * 2. * size - .5));
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    st *= 18.;
    
    vec3 color = vec3(floor(st.x) > floor(st.y));
    if (tri_int_wave(u_time, 8.) == int(floor(st.y))) color = vec3(1., 0., 0.);
    
    gl_FragColor = vec4(color,1.0);
}
