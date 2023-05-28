// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.14159265;

vec2 cpx_inv(vec2 a) {
    return a / dot(a, a);
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

	st = st * 2. - 1.;
    st *= 1.176;
    
    ivec2 cumba = ivec2(0);
    for (int i = 1; i < 3; i++) {
    	st = cpx_inv(st);
        cumba += ivec2(floor(st));
        st = fract(st);
        st = st * 2. - 1.;
    }

    st = cpx_inv(st + 0.1);
    
    //float w = 0.100;
    //bvec2 b = lessThan(abs(st - 0.5), vec2(w));
    vec2 v = vec2(cumba)/5.;
    float q = atan(v.y, v.x);
    q = (q / PI + 1.) / 2.;
    float t = u_time;
    
    vec3 color = vec3(fract(q * 4.) < 0.5);
    //if (b.x) color += vec3(0.073,0.479,0.905);
    //if (b.y) color += vec3(0.905,0.660,0.320);

    return color;
}

void main() {
    const int AA_DIVS = 3;
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
