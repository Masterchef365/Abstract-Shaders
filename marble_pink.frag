
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int ITERS = 149;
const int AA_DIVS = 3;

float marble(vec2 pos) {
    vec2 st = (pos/min(u_resolution.x, u_resolution.y)) * 2. - 1.;
    st = st.yx;
    st -= vec2(-0.060,0.500);
    st *= 1.5;
    vec2 q = vec2(0.);
    float g = 0.;
    for (int i = 0; i < ITERS; i++) { 
    	q += cos(st * vec2(i) + q.yx);
        q = q + dot(q, vec2(0.710,-0.730));
        g += abs(q.x) - abs(q.y);
        if (abs(q.x) < 0.02 || abs(q.y) < 0.021) break;
    }
    return g;
}

vec3 sample(vec2 pos) {
    float g = marble(pos);
    g /= float(ITERS * 7);
    if (g < 0.01) {
        return vec3(1);
    } else {
        return g * vec3(1.000,0.146,0.533) * 1.8;
    }
} 

void main() {
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += sample(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
