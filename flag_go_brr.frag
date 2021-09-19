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

vec3 shape(vec2 st) {
    float t = atan(st.y, st.x);
    float d = length(st);
    //float anim = -2.144;
    float anim = u_time;
    float g = fract(8. * t / tau + d + anim / 10.);
    
    float q = abs(g - .5) * 2.;
    vec3 color;
	if (q < 0.3333) {
        color = vec3(0x55, 0xCD, 0xFC) / float(0xFF);
    } else if (q < 0.6666) {
        color = vec3(1.);
    } else {
        color = vec3(0xF7, 0xA8, 0xB8) / float(0xFF);
    }

    return color;
}


vec2 tri_quantize(vec2 p, float divs) {
    const float pi = 3.141592;
    const float a = 0.;
    const float b = 2.*pi/3.;
    const float c = 4.*pi/3.;
    
    // 3 vectors placed such that drawing lines 
    // between their tips would form an equilateral triangle
    vec3 g = vec3(
        p.x * cos(a) + p.y * sin(a),
        p.x * cos(b) + p.y * sin(b),
        p.x * cos(c) + p.y * sin(c)
    );
    
    // Each component of one_if_neg is one if the corresponding component of g is negative
    ivec3 one_if_neg = ivec3(lessThan(g, vec3(0.))); 
    
    // Quantize on each of these dimensions, and avoid repeating zero (since abs(-.5) = 0 and abs(.5) = 0)
    g = vec3(ivec3(g * divs) - one_if_neg) / divs;
    
    // Now imagine we pick two of the vectors; the difference 
    // between them will be perpendicular to the remaining vector.
    vec2 q = vec2(g.x, (g.y - g.z) / 2.);
    
    return q;
}

vec3 pixel(vec2 p) {
    vec2 st = (p / u_resolution.xy) * 2. - 1.;
    st = tri_quantize(st, 20.);
    return shape(st);
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

