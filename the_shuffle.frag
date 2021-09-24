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
    for (int i = 0; i < 3; i++) { 
        float m = float(i);
    	q += cos(st * vec2(28. - m, 28. * m) + q.yx);
    }
    float g = dot(q, vec2(cos(u_time), sin(u_time)));
	return vec3(fract(g) < 0.060 * 2.128)
        * vec3(
        	cos(g * 2.816), 
        	cos(g * -0.208), 
        	cos(g * 1.028));
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
