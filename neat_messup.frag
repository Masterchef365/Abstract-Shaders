// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

vec3 sgncolor(float x) {
    if (x > 0.) {
        return x * vec3(1.000,0.312,0.051);
    } else {
        return -x * vec3(0.046,0.440,1.000);
    }
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    float d = 0.300;
    vec2 q1p = vec2(-d, 0.);
    vec2 q2p = vec2(d, 0.);
    float q1 = 1.;
    float q2 = -1.;
    
    vec2 q1_diff = st - q1p;
	vec2 q2_diff = st - q2p;	    
    
    float q1a = atan(q1_diff.y, q1_diff.x) / pi;
    float q2a = atan(q2_diff.x, q2_diff.x) / pi;
    
    float q1d = distance(st, q1p);
    float q2d = distance(st, q2p);
    
    float q = q1/q1d + q2/q2d;
    
    vec3 color = sgncolor(q * 0.174);
    if (fract(abs(q) * 8.) < 0.122) color = vec3(0.271,1.000,0.086);
    
    color += vec3(fract(((q1a * q1d) + (q2a * q2d)) * 18. / (q1d + q2d)) < 0.080);

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
