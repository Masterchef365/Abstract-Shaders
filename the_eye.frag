// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;

    vec3 color = vec3(1.);//vec3(1.000,0.991,0.986);
    st -= vec2(0.015,0.460) * 8.;
    st /= 2.120;
    
    for (int j = 0; j < 5; j++) {
        for (int i = 0; i < 3; i++) 
            st += cos(st.yx * 0.9) * 2.336 + vec2(-0.290,-0.670) * st.xy;
            st = fract(st) * 2. - 1.;

            if (length(st - vec2(-0.360,0.080)) < 0.4) color -= 1. - vec3(0.478,0.894,1.000);
            if (length(st - vec2(-0.010,0.420)) < 0.4) color -= 1. - vec3(1.000,0.226,0.594);
            if (length(st - vec2(0.120,-0.080)) < 0.4) color -= 1. - vec3(0.992,1.000,0.185);
    }
        
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