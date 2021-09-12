
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int ITERS = 149;
const int AA_DIVS = 5;

float marble(vec2 pos) {
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    vec2 q = vec2(0.);
    float g = 0.;
    for (int i = 0; i < ITERS; i++) { 
        float m = float(i);
    	q += cos(st * vec2(1. - m, 1.720 * m) + q.yx);
        q = q + dot(q, vec2(0.440,-0.420));
        g += abs(q.x) - abs(q.y);
        if (abs(q.x) < 0.02 || abs(q.y) < 0.021) break;
    }
    return g;
}

vec3 sample(vec2 pos) {
    float g = marble(pos);
    g /= float(ITERS * 7);
    if (g < 0.01) {
        return vec3(1.);
    } else {
        return g * vec3(0.704,0.256,1.000);
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
