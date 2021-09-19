// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int ITERS = 59;

float marble(vec2 pos) {
    vec2 st = (pos/min(u_resolution.x, u_resolution.y)) * 2. - 1.;
    st = st.yx;
    st -= vec2(0.420,-0.030).yx;
    vec2 q = vec2(0.);
    float g = 0.;
    for (int i = 0; i < ITERS; i++) { 
    	q += cos(st * vec2(i) + q.yx);
        q = q + dot(q, vec2(0.670,-0.690));
        g += abs(q.x) - abs(q.y);
        if (abs(q.x) < 0.02 || abs(q.y) < 0.021) break;
    }
    return g;
}

vec3 smpl(vec2 pos) {
    float g = marble(pos);
    g /= float(ITERS * 7);
    if (g < 0.08) {
        return vec3(1);
    } else {
        return g * vec3(0.004,0.444,1.000) * 1.8;
    }
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



void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st *= 40.;
    
    vec2 q = tri_quantize(st, 0.5);
   	vec3 color = smpl(q);

    gl_FragColor = vec4(color,1.0);
}
