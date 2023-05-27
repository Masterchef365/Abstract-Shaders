// Author:
// Title:

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;
  	st *= 2.136;
    
    //st -= vec2(-0.500,-1.000);
    
    vec2 p = vec2(0.110,-0.010);
    for (int i = 0; i < 11; i++) {
        float r = dot(p.yx, st)*4.;
        p += vec2(cos(r), sin(r));
    }
    
    vec3 color = vec3(length(p) < 2.068) * vec3(0.345,0.359,1.000) * 5.;
	return color;
}

void main() {
    const int AA_DIVS = 6;
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
