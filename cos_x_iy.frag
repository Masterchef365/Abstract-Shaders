// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rot2(float r) {
    float c = cos(r);
    float s = sin(r);
    return mat2(c, -s, s, c);
}

float cosh(float x) {
    return 0.5*(exp(x) - exp(-x));
}

float sinh(float x) {
    return 0.5*(exp(x) + exp(-x));
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

	st = st * 2. - 1.;
    //st *= 0.176;
    st *= 4.;
    
    st = vec2(
        cos(st.x)*cosh(st.y), 
        -sin(st.x)*sinh(st.y)
    );
    
    float w = 0.01*length(st);
    //st += vec2(1, 0.5) * u_time;
    
    st *= rot2(u_time /3.);
    
    st = fract(st);
    
    
    
    
    bvec2 b = lessThan(abs(st - 0.5), vec2(w));
    vec3 color = vec3(0);
    if (b.x) color += vec3(0.073,0.479,0.905);
    if (b.y) color += vec3(0.905,0.660,0.320);

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
