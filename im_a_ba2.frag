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
    vec2 st = (coord/min(u_resolution.x, u_resolution.y)) * 2. - 1.;
    st /= 9.440 * 0.030;
    //st += u_time / 200.;
    
    vec2 q = st;
    vec2 p = vec2(st);
    for (int i = 0; i < 11; i++) {
        q = complex_mul(q, vec2(sin(st * float(i))));
        p += q;
        q += p;
    }
    
    float df = dot(normalize(p), unit_circ(u_time));
    vec3 color = vec3(mix(vec3(1.000,0.328,0.174), vec3(0.328,0.069,0.380), df));

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