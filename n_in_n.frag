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
const int sides = 5;

vec2 complex_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x
    );
}

vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    const float unit_angle = tau / float(sides);
    const float half_unit = pi / float(sides);
    const float internal_angle = pi * float(sides - 2) / float(sides);
    vec2 unit_vect = unit_circ(unit_angle);

    const float line_width = 0.003;
    float sz = 0.060;
    bool b = false;
    float r = 0.;
    
    float dr = fract(u_time / 20.) * unit_angle;
    
    for (int j = 0; j < 30; j++) {
        float dist = 0.;
        vec2 rot = unit_circ(r);
        for (int i = 0; i < sides; i++) {
            rot = complex_mul(rot, unit_vect);
            float d = dot(st, rot);
            dist = max(dist, d);
        }
        b = b || abs(dist - sz) < line_width;
        r += dr;
        
        sz *= (sin(dr) + sin(pi - internal_angle - dr)) / sin(internal_angle);
    }
        
    return vec3(b);
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
