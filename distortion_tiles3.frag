// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    st *= pow(0.744, 2.);
    
    for (int i = 1; i < 8; i++)
    	st += cos(st.yx * float(i) * mix(.5, 7., cos(u_time / 30.))) / 10.;
    
    bool k = all(lessThan(fract(st * 3. + u_time / 30.), vec2(0.05, 0.1)));
    vec3 color = vec3(k) * vec3(0.236,0.817,1.000) * 4.;

    return color;
}

void main() {
    const int AA_DIVS = 3;
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

