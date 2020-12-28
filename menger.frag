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
    float f = mod(u_time, 5.);
    
    for (int i = 0; i < 5; i++) {
        float base = mix(0.5, 0.3333, min(f - float(i), 1.));
        float left = base;
        float right = 1. - base;
        it = it && ((st.x < left || st.x > right) || (st.y < left || st.y > right));
    	st = fract(st * 3.);
    }
    vec3 color = vec3(it);
    

    gl_FragColor = vec4(color,1.0);
}
