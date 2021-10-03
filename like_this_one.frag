// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    //st.x *= u_resolution.x/u_resolution.y;
    st *= 7.460;

    int x = 1;
    int y = 1;
    vec2 q = vec2(0.);
    for (int i = 0; i < 12; i++) {
        int tmp = y + x;
        x = y;
        y = tmp;
        float m = float(y);
    	q += cos(st * vec2(1. - m, 1.720 * m) + q.yx) + st;
        q = q + dot(q, vec2(0.210,-0.030));
    }
    
    //return vec3(length(q) < 3.956);
    return mix(vec3(1.000,0.655,0.273), vec3(0.510,0.039,0.482), q.x / 50.);
}


void main() {
    const int AA_DIVS = 0;
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
