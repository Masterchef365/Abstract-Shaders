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
        //dot(a, b),// = cos(theta) ||a|| ||b||
        a.x * b.y - a.y * b.x
        //cross2d(a, b)// = sin(theta) ||a|| ||b||
    );
}

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
	st *= 80.;

    float j = 0.;
    const int steps = 6;
    for (int i = 1; i <= steps; i++) {
        float freq = 1. * float(i) / float(steps);
        float shonky = cos(length(st) * freq);
        const float width = 0.03;
        j += float(abs(shonky) < width) * float(i);
        vec2 g = complex_mul(st, unit_circ(u_time / 18.));
        st += cos(g / float(steps)) * 8.;
    }
    
    vec3 color = vec3(j * 8. / float(steps * steps));
    
    return color;
}

void main() {
    const int AA_DIVS = 1;
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