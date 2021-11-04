// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;
const float tau = pi * 2.;

vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.y + a.y * b.x,
        a.x * b.x - a.y * b.y
    );
}

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 7.136;

    vec3 color = vec3(0.);
    
    vec2 g = st;
    for (int i = 0; i < 4; i++) {
        float r = fract(u_time / 50.) * tau;
        vec2 u = unit_circ(dot(g, unit_circ(r)));
        g += complex_mul(g, u);
    }
    
    g = fract(g / 10000.);
    
    color = mix(
        mix(vec3(1.000,0.623,0.201), vec3(0.960,0.171,0.586), g.x),
        mix(vec3(0.343,0.083,0.385), vec3(0.461,0.031,0.800), g.x),
        g.y
    );

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
