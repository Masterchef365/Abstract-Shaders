// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 skinny(float g) {
    g /= 2.392;
    g += 1.488;
    g /= 3.128;
    return mix(
        mix(vec3(0.066,0.089,0.340),vec3(0.191,0.591,0.850), g),
        mix(vec3(0.716,0.508,0.960),vec3(1.000,0.257,0.848), g),
        g
    );
}

vec3 sample(vec2 pos) {
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    vec2 q = vec2(0.);
    for (int i = 2; i < 18; i++) { 
        float m = float(i);
    	q += cos(st * vec2(8. - m, 3. * m) + q.yx);
        if (abs(q.x) < 0.02 || abs(q.y) < 0.004) return vec3(0.);
    }
    return abs(vec3(
        dot(q, vec2(-0.240,0.580)),
        dot(q, vec2(-0.050,-0.200)),
        dot(q, vec2(0.260,0.290))
    )) / 1.5;
}

void main() {
    const int AA_DIVS = 2;
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
