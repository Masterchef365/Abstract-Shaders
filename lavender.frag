// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const vec2 eq_tri = vec2(1., sqrt(3.)) / 2.;
const vec2 eq_tri_half = eq_tri.yx;

vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x
    );
}

bool cross2dsgn(vec2 k, vec2 j) {
    return k.x * j.y > k.y * j.x;
}

bool between(vec2 st, vec2 a, vec2 b) {
    return cross2dsgn(a, st) && cross2dsgn(st, b);
}

bool tri_inside(vec2 st, vec2 a, vec2 b) {
    return cross2dsgn(b - a, st - a);
}

bool hexagon(vec2 st, float r) {
    vec2 a = vec2(r, 0.);
    bool hex = true;
    for (int i = 0; i < 6; i++) {
        vec2 b = complex_mul(a, eq_tri);
        hex = hex && tri_inside(st, a, b);
        a = b;
    }
    return hex;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

	vec3 color = vec3(0.);
    float r = 1.;
    const int steps = 10;
    for (int i = 0; i < steps; i++) {
        int g = int(mod(float(i), 4.));
        //float k = float(i) / float(steps);
        if (hexagon(st, r)) {
            /*vec3 base_color = mix(
                vec3(0.669,0.535,0.970), 
                vec3(0.985,0.393,0.830), 
                k * 2.728 + -1.404
            );
            color -= (1. - base_color) * 0.092;
            */
            if (g == 0) color = vec3(0x89, 0x5b, 0xe1) / 255.;
            if (g == 1) color = vec3(0x66, 0x47, 0xce) / 255.;
            if (g == 2) color = vec3(0xad, 0x92, 0xf2)/ 255.;
            if (g == 3) color = vec3(0.214,0.054,0.475);
        }
        
        vec2 a = eq_tri_half;
        for (int j = 0; j < 6; j++) {
            vec2 b = complex_mul(a, eq_tri);
            if (between(st, a, b)) {
                a = complex_mul(a, eq_tri_half);
            	break;
            }
            a = b;
        }
        r /= min(fract(u_time / 10.) * 3. + 0.5, 3.);
        st -= a * r * 2.;
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
