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
    st.x *= u_resolution.x/u_resolution.y;
	st = st * 2. - 1.;
    
    float space = length(st) * 5.;
    const float tau = 3.141592 * 2.;
    float a = atan(st.y, st.x) / tau + 0.5;
    
    float innerspace = abs(fract(space*2.)-0.5)*2.;
    float rounderspace = fract(floor(space + fract(0.) * 8.)*a);
    float edgespace = clamp(1. - abs(rounderspace - 0.5) * 8., 0., 1.);
    
    vec3 color = vec3(
        fract(space) < 0.5
		&& sqrt(pow(innerspace,2.) - pow(edgespace,2.)) < 0.332
    );

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
