// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 1.520;

    const float k = 6.784;
    const float a_ngle = 1.;
    vec2 a = unit_circ(a_ngle);
    float anim = fract(u_time / 100.);
    vec2 b = unit_circ(anim * pi * 2.);
    for (int i = 0; i < 3; i++) {
        st = vec2(
            cos(distance(st, b) * k),
            cos(distance(st, a) * k)
        );
    }
    vec3 color = vec3(fract(st.x) < 0.074)
        * mix(
        	vec3(1., 1., 0.), 
        	vec3(1., 0., 1.), 
        	acos(st.y)
        );

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
