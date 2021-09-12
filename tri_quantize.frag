// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy);
    
    vec2 q = tri_quantize(st, 8.);
    vec3 color = vec3(q, 0.);

    gl_FragColor = vec4(color,1.0);
}
