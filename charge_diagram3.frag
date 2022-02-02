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

float cross_mag(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}

float proj(vec2 u, vec2 v) {
    return dot(u, v) / dot(v, v);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    float d = 0.276;
    vec2 q1p = vec2(-d, 0.);
    vec2 q2p = vec2(d, 0.);
    float q1 = 1.;
    float q2 = -1.;
    
    vec2 q1_diff = st - q1p;
	vec2 q2_diff = st - q2p;	    
    
    float q1d = distance(st, q1p);
    float q2d = distance(st, q2p);
    
    float q = q1/q1d + q2/q2d;
    
    vec3 color = sgncolor(q * 0.174);
    if (fract(abs(q) * 8.) < 0.122) color = vec3(1);

    vec2 e = q1 * normalize(q1_diff) / (q1d * q1d);
    e += q2 * normalize(q2_diff) / (q2d * q2d);
    
    if (abs(fract(atan(e.y, e.x) * 8. / pi) - .5) < 0.044) color = vec3(1.);
 
    //color += vec3(abs(proj(e, vec2(0.230,0.860))) < 0.032);
    //color += vec3(abs(cross_mag(e, vec2(-0.190,0.710))) < 0.025);
    //color = vec3(e, 0);
    //color += vec3(fract(length(e)) < 0.108);
    
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
