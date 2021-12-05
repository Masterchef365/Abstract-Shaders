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
    st *= 15.;
    st += vec2(-0.840,0.390) * 70.128;
    //st += u_time / 200.;
    
    vec2 q = st;
    for (int i = 0; i < 13; i++) {
        vec2 u = unit_circ(length(st));
        vec2 c = complex_mul(st, unit_circ(length(q)));
        const float len = 35.;
        const float rate = 0.4;
        q = u * c / (fract(u_time * rate / len) * len);
    }
    
    float anim = 0.;//u_time;
    vec3 color = vec3(
        abs(dot(q, unit_circ(anim / 10.)) - 0.356) < 0.056,
        abs(dot(q, unit_circ(anim / 10.)) - 0.316) < 0.056,
        abs(dot(q, unit_circ(anim / 10.)) - 0.260) < 0.056
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
