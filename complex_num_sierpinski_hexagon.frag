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
    for (int i = 0; i < 7; i++) {
        if (!hexagon(st, r)) {
            color += vec3(0.447,0.715,0.164);
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
        r /= 3.;
        st -= a * r * 2.;
    }

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
