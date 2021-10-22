// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rotation2d(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat2(
		c, -s,
		s, c
	);
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    bool it = true;
    const int max_iters = 9;
    //float f = mod(u_time, float(max_iters + 28));
    float f = float(max_iters);
    
    float mixer = 0.;
    for (int i = 0; i < max_iters; i++) {
        st -= vec2(.53);
        st *= rotation2d(-3.141502/4.);
        st += vec2(.5);
        
        vec2 g = st * 2. - 1.;
        bool it = length(g) > 0.700;
    	st = fract(st * 2.);
        
        if (it) {
            mixer += 1. / float(max_iters);
        }
    }
    vec3 color = mix(vec3(0.681,0.965,0.267), vec3(0.050,0.048,0.048), mixer);
    
	return color;
}

void main() {
    const int AA_DIVS = 0;
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
