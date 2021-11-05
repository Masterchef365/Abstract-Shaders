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
    
    st *= 2.112;

    const float k = 7.864;
    const float a_ngle = 1.;
    //vec2 a = unit_circ(a_ngle);
    float anim = fract(u_time / 100.) * 2. * pi;
    //vec2 b = unit_circ(anim * pi * 2.);
    vec2 a = vec2(0);
    vec2 b = vec2((cos(anim) + 1.) / 2.);
    for (int i = 0; i < 3; i++) {
        st = vec2(
            cos(distance(st, b) * k),
            cos(distance(st, a) * k)
        );
    }
    vec3 color = vec3(fract(st.x) < 0.098)
        * mix(
        	vec3(0.954,1.000,0.946), 
        	vec3(0.172,1.000,0.345), 
        	fract(st.y)
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
