// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

bool grid(vec2 st, float size, float width) {
	bvec2 g = lessThan(fract(st * size), vec2(width));
    return g.x || g.y;
}

vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x + a.y * b.y,
        a.y * b.x - a.x * b.y
    );
}

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coords) {
    vec2 st = (coords/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 0.460;

    vec3 color = vec3(0.);
    const float size = 8.216;
    const float width = 0.140;
    
    bool g = true;
    vec2 off_st = st;
    vec2 rot = unit_circ(u_time / 100.);
    int b = 0;
    for (int i = 0; i < 18; i++) {
        off_st = complex_mul(off_st, rot);
        bool k = grid(off_st + width / 2., size, width);
        g = g != k;
		if (k) b += 1;
    }
    
    color = (vec3(b * b) / 6.) * vec3(1.000,0.194,0.060);

    //st.x += cos(st.y * 8.288 + u_time / 3.) * .1; // Enable Flatworm
    
    
     if (length(st) < 0.068) color = vec3(1);
    if (length((st + vec2(-sign(st.x) * -0.028, 0)) * vec2(0.980,-0.500)) < 0.046) color = vec3(0);
   

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
