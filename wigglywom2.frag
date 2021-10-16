// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
	st *= 80.;

    float j = 0.;
    const int steps = 13;
    for (int i = 1; i <= steps; i++) {
        float freq = 1. * float(i) / float(steps);
    	j += sign(cos((length(st) - u_time * 8.) * freq));
        st += cos(st.yx / 10.);
    }
    
    vec3 color = vec3(abs(j) / float(steps));
    
    gl_FragColor = vec4(color,1.0);
}