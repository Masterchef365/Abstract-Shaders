// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    for (int i = 0; i < 6; i++) {
        if (st.x > 1./3. && st.x < 2./3. && st.y > 1./3. && st.y < 2./3.) {
            int g = int(mod(float(i), 3.));
            if (g == 0) {
                color = vec3(0.);
            } else if (g == 1) {
                color = vec3(.5, 0., .5);
            } else if (g == 2) {
                color = vec3(163. / 255.);
            }
            break;
        }
        st = fract(st * 3.);
    }
    
	return color;
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
