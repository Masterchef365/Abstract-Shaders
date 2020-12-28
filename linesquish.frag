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

    bool it = true;
    const int max_iters = 4;
    float f = mod(u_time, float(max_iters));
    
    for (int i = 0; i < max_iters; i++) {
        float base = mix(0.500, 0.245, min(f - float(i), 1.));
        float left = base;
        float right = 1. - base;
        it = it && ((st.x < left || st.x > right) == (st.y < left || st.y > right));
    	st = fract(st * 2.);
    }
    vec3 color = vec3(it);
    

    gl_FragColor = vec4(color,1.0);
}
