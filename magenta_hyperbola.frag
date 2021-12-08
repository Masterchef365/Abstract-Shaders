// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x + a.y * b.y,
        a.y * b.x - a.x * b.y
    );
}

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= pow(1.000, 2.);

    vec2 g = st;
    for (int i = 0; i < 6; i++) {
        vec2 q = g * g;
        g += vec2(
            fract(q.x - q.y),
            fract(q.x + q.y)
        ) * 2. - 1.;
    }
    
    float len = length(g);
    
    vec3 color = vec3(len < 1.644) * mix(vec3(0.922,0.935,1.000), vec3(0.975,0.017,0.729), len);

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
