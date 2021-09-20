// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 st) {
    st /= u_resolution.xy;
    vec3 q = vec3(0.366,0.426,0.934);
    float t = cos(u_time / 2.);
    for (int i = 0; i < 28; i++) {
        q += cos(
        	q.zxy
        	* vec3(0.293,1.184,0.896)
            * 4.
            + vec3(st.xy, t)
        );
    }
    

    return clamp(q, vec3(0), vec3(1));
}


void main() {
    const int AA_DIVS = 1;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += pixel(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
