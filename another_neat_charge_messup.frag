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
        return x * vec3(1.000,0.312,0.051);
    } else {
        return -x * vec3(0.046,0.440,1.000);
    }
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    float d = 0.500;
    vec2 q1p = vec2(-d, 0.);
    vec2 q2p = vec2(d, 0.);
    float q1 = 1.;
    float q2 = -1.;
    
    float q1d = distance(st, q1p);
    float q2d = distance(st, q2p);
    
    vec2 q1_rhat = normalize(st - q1p);
    vec2 q2_rhat = normalize(st - q2p);
    
    float v = q1/q1d + q2/q2d;
    
    vec2 q1e = q1*q1_rhat/(q1d * q1d);
    vec2 q2e = q2*q2_rhat/(q2d * q2d);\
    vec2 e = q1e + q2e.yx;
    
    vec3 color = sgncolor(v * 0.686);
    if (abs(fract(v * 1.) - .5) < 0.026) color = vec3(1);
    
    color = vec3(abs(fract(atan(e.y, e.x) * 8. / 3.145 + u_time) - .5) < 0.018);

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
