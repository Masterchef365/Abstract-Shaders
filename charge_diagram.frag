// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 sgncolor(float x) {
    if (x > 0.) {
        return x * vec3(1., 0.1, 0.1);
    } else {
        return -x * vec3(0.1, 0.1, 1.);
    }
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    float d = 0.348;
    vec2 q1p = vec2(-d, 0.);
    vec2 q2p = vec2(d, 0.);
    float q1 = 2.;
    float q2 = -0.888;
    
    float q1d = distance(st, q1p);
    float q2d = distance(st, q2p);
    
    float q = q1/q1d + q2/q2d;
    
    vec3 color = sgncolor(q * 1.278);
    if (abs(q) < 0.01) color = vec3(0.409,1.000,0.204);

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
