// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 distort(vec2 st) {
    const int steps = 4;
    vec2 p = st;
    for (int i = 0; i < steps; i++) {
		p += cos(p.yx * cos(u_time / 10.) * 6.28 + st.yx);
    }
    return p;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 d = distort(st / 1.);
    //d = st;
    vec3 color = vec3(d, 0.);
    color = vec3(lessThan(abs(fract(d).xy - .5), vec2(0.1)), 0);
    
	return color;
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
