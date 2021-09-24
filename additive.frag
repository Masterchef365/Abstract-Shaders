// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 sample(vec2 pos) {
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    vec2 q = vec2(0.);
    vec3 color = vec3(0);
    for (int i = 0; i < 49; i++) { 
        float m = float(i);
    	q += cos(st * vec2(1. - m, 1.720 * m) + q.yx);
        q = q + dot(q, vec2(0.440,-0.420));
        if (abs(q.x) < 0.036 || abs(q.y) < 0.029) 
            color += vec3(0.083,0.655,0.430) * float(m / 20.);
    }
    return color;
    /*return abs(vec3(
        dot(q, vec2(-0.240,0.580)),
        dot(q, vec2(0.100,-0.090)),
        dot(q, vec2(0.260,0.290))
    )) / 2.6;*/
}

void main() {
    const int AA_DIVS = 1;
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
