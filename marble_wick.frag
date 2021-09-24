// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 pos) {
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    vec2 q = vec2(0.);
    for (int i = 0; i < 149; i++) { 
        float m = float(i);
    	q += cos(st * vec2(1. - m, 1.720 * m) + q.yx);
        q = q + dot(q, vec2(0.440,-0.420));
        if (abs(q.x) < 0.02 || abs(q.y) < 0.021) return vec3(0.);
    }
    return vec3(1.);
}

void main() {
    const int AA_DIVS = 5;
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
