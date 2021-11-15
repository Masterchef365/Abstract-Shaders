// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

int tri_int_wave(float x, float size) {
    return int(ceil(abs(fract((x + .5) / (size * 2.)) - .5) * 2. * size - .5));
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    st *= 8.;
    
    vec3 color = vec3(float(tri_int_wave(st.x, 5.)) > floor(st.y));
    //if (st.x < 0.0 && st.y > 0.0)
    
    gl_FragColor = vec4(color,1.0);
}
