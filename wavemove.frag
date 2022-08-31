
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st = st * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    

    vec3 color = vec3(0.);
    
    const int iters = 30;
    for (int i = 0; i < iters; i++) {
        float j = float(i) / float(iters);
    
        vec2 m = st;
        m += vec2(0.720,0.710) * j;
        m.x += u_time / 10.;
        
        float p = cos(m.x * 8.) + cos(m.x * 300. + u_time * 10.) / 20.;
        
        float k = 1. - 100. * abs(p - m.y / 0.616);
    	color += vec3(max(k, 0.));
        
    }
    
    color = min(color, vec3(1));

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
