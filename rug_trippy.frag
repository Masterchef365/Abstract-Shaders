// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 1.;
    
    const vec2 window_size = vec2(1.,0.90);
    st = window_size * (fract(st / window_size) * 2. - 1.);

    vec3 color = vec3(0.);
    vec2 abspace = abs(st);
    
    const vec2 rect_dims = vec2(0.740,0.60);
    
    vec2 g = abspace - rect_dims;
    float k = max(g.x, g.y);
    const float sep = -0.028;
    k = min(k, distance(abspace, vec2(rect_dims.x, 0.3)) - (sep + window_size.x - rect_dims.x));
    k = min(k, distance(abspace * vec2(0.540,0.460), vec2(0., rect_dims.y)) - (sep + window_size.y - rect_dims.y));
    
    bool lines = k > -0.036 && k < 0.200;
    color = fract(k * 8. + u_time) < .2 ? vec3(1.) : 
    	hsv2rgb(vec3(k * 2. - u_time / 4., 1. -fract(k * 8.), 1.));
    //color = vec3();
    
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
