// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

float cmax(vec2 c) {
    return max(c.x, c.y);
}

mat2 rot2d(float r) {
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    ); 
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    float line_width = 0.003;
    float circ_width = 0.163;
    
    float sz = 0.109;
    bool b = false;
	vec3 color = vec3(0);
    float dr = fract(u_time / 20.) * pi / 2.;
    for (int i = 0; i < 30; i++) {
    	b = b || abs(cmax(abs(st) - sz)) < line_width;
        bool circ = abs(length(abs(st) - sz)) < circ_width;
        if (circ) color = mix(vec3(0.770,0.233,1.000), vec3(1.000,0.449,0.003), cos(sz * 8.));
        sz = (cos(dr) + sin(dr)) * sz;
        st *= rot2d(dr);
    }
	if (b) color = vec3(1);
    
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
