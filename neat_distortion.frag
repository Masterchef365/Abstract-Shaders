// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float logistic(float x) {
    return 1. / (1. + exp(-x));
}

vec3 testpat(vec2 p) {
    const float width = 0.03;
    const float scale = 8.;
    bvec2 q = lessThan(abs(fract(p * scale) - .5), vec2(width));
    if (q.x || q.y) return vec3(1.);
    return vec3(0);//vec3(logistic(p.x), logistic(p.y), 0);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y; 
    st *= 1.;
    
    
    const int steps = 6;
    vec3 pos = vec3(st, 0.);
    vec3 dir = vec3(0., 0., 1.);
    vec3 mass_pos = vec3(0., 0., 0.5);
    const float strength = -88.460;
    for (int i = 0; i < steps; i++) {
        vec3 pos_diff = pos - mass_pos;
        dir += normalize(pos_diff) * strength * dot(pos_diff, pos_diff) / float(steps);
        pos += dir / float(steps);
    }

    vec3 color = vec3(testpat(pos.xy));

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
