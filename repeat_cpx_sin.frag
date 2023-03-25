// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 cpx_sin(vec2 c) {
    return vec2(
        sin(c.x) * (exp(-c.y) + exp(c.y)),
        cos(c.x) * (exp(-c.y) - exp(c.y))
    ) / 2.;
}

float triangle(float x) {
    return abs(fract(x) - 0.5) * 2.;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 3.328;
    
    vec2 q = vec2(1., 1.);
    for (int i = 0; i < 5; i++)
        q = cpx_sin(q) + st;

    
    
    //st = mix(st, q, triangle(u_time / 10.));
    st = q;

    vec2 f = fract(st);
    bool b = any(lessThan(f, vec2(0.05)));
    vec3 color = vec3(b);
    color = 1. - vec3(
        fract(length(st)) > 0.174
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
