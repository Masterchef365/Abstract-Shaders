// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;
const float tau = 2. * pi;

float triangle(float x) {
    return abs(fract(x) - .5) * 2.;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    const float size = 30.;
    st *= size;

    float r = (atan(st.y, st.x) + pi) / tau;
    
    float d = length(st);
    
    float part = fract(d);
    float level = floor(d);
    
    float divs = max(level + mix(-size * sqrt(2.), 1., triangle(u_time / 3. / size)), 0.) * pi;
    
    bool k = true;
    
    k = k != fract(r * divs) < .5;
    
	vec3 color = vec3(k) * vec3(abs(part - .5) < 0.2) * mix(vec3(1.000,0.494,0.015), vec3(0.252,0.005,1.000), float(level) / size);
    
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
