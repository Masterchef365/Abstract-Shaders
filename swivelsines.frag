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
        a.x * b.x - a.y + b.y,
        a.x * b.y + a.y * b.x
    );
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    //vec2 sti = st;
    
    bool fric = false;
    for (int i = 0; i < 8; i++) {
        st = complex_mul(st, normalize(vec2(0.480,0.820)));
        if (abs(st.x + cos(st.y * 199.944 * fract(u_time*u_time / 80000.))) < 0.02) {
            fric = true;
            break;
        }
    }
    vec3 color = vec3(fric) * vec3(0.862,0.396,1.000);
    
    //color = vec3(sti, 0.);

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