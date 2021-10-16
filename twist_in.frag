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
	st *= 70.;

    float j = 0.;
    const int steps = 8;
    for (int i = 1; i <= steps; i++) {
        float freq = 2. * float(i) / float(steps);
        float shonky = cos((length(st) - u_time / 2.) * freq);
        const float width = 0.1;
        j += float(abs(shonky) < width) * float(i) / 2.;
        st += cos(st.yx / float(steps) * 1.) * 20. * fract(u_time / 10.);
    }
    
    vec3 color = vec3(j * 3. / float(steps));
    
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