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
        float anim = fract(u_time / 20.);
        anim = 8. * anim * anim + 0.6;
        st = fract(st * anim) + cos(st.yx);
        const float lo = 1./3.;
        const float hi = 2./3.;
        if (st.x > lo && st.x < hi && st.y > lo && st.y < hi) {
            int g = int(mod(float(i), 3.));
            if (g == 0) {
                color = vec3(1.);
            } else if (g == 1) {
                color = vec3(.5, 0., .5);
            } else if (g == 2) {
                color = vec3(163. / 255.);
            }
            break;
        }
        
    }
    
	return color;
}

void main() {
    const int AA_DIVS = 2;
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
