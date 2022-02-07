// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 distort(vec2 st) {
    const int steps = 13;
    vec2 p = st;
    for (int i = 0; i < steps; i++) {
		p += cos(p.yx * 3.1415 + st.yx);
    }
    return p;
}

float quickstep(float x, float rate) {
    return float(x > .5);
    const float center = 0.5;
    return clamp((x - center) * rate + center, 0., 1.);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec2 d = distort(st / 0.424);
    //d = st;
    vec3 color = mix(
        mix(vec3(1.000,0.786,0.038), vec3(0.945,0.111,0.387), quickstep(d.x, 5.)),
		mix(vec3(0.), vec3(0.219,0.482,1.000), quickstep(d.x, 5.)),
        quickstep(d.y, 5.)
    );
    
	return color;
}

void main() {
    const int AA_DIVS = 4;
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
