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

// Returns true where `x` is within `width` of an integer 
bool integer_lines(float x, const float width) {
    return abs(fract(x + .5) - .5) < width;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    // Wavelength
    const float wavelength = 0.3;
    
    // Seperation (as a multiplier of wavelength)
    const float sep = wavelength * 1.7;
    
    // Point source positions
    const vec2 a = vec2(-sep/2., 0.);
    const vec2 b = vec2(sep/2., 0);
    
    // Interference line width
    const float line_width = 0.02;

    // Distance calculations
    float da = distance(st, a);
    float db = distance(st, b);
    float dd = abs(da - db);
    
    // Display animation
    float anim = -u_time;
    vec3 color = vec3(0);
    
    // Point sources
    color += vec3(0., 1., 0.) * max(cos(anim + tau * (da / wavelength)), 0.);
    color += vec3(1., 0., 0.) * max(cos(anim + tau * (db / wavelength)), 0.);
    
    // Maximum constructive interference
    color += vec3(1.) * float(integer_lines(dd / wavelength, line_width));
    
    // Complete destructive interference
    color += vec3(.5) * float(integer_lines(dd / wavelength + .5, line_width));

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
