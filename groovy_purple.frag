
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 sample(vec2 pos) {
    float t = u_time;
    
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 q = vec2(0.);
    for (int i = 0; i < 10; i++) { 
        float m = float(i);
    	q += cos(st * vec2(8. - m, 3. * m) + q.yx);
    }
    //vec2 l = vec2(cos(u_time), sin(u_time));
    vec2 l = vec2(0.550,-0.400);
    float g = dot(q, l);
	return vec3(fract(g * 1. + t / 3.) < 0.060 * 0.856)
        * mix(vec3(1.), vec3(0.803,0.253,0.990), abs(g));
}

void main() {
    const int AA_DIVS = 1;
    const int AA_WIDTH = AA_DIVS+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x < AA_DIVS; x++) {
        for (int y = -AA_DIVS; y < AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += sample(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
