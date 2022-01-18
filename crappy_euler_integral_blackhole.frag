// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;
const float tau = pi * 2.;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    float theta = 1.760; // Angle with respect to the accretion disc
    float c = 0.02; // Speed of light
    float obv_dist = 1.; // Observer distance (relative to hole)
    float hole_radius = 0.3;
    float disc_min_radius = 0.460;
    float disc_max_radius = 1.008;
    
    float photon_inertia = 0.003;
    
    vec3 disc_norm = vec3(0., sin(theta), cos(theta)); // Normal of the disc
    
    vec3 pos = vec3(st, -obv_dist); // Position of the photon
    vec3 dir = vec3(0., 0., 1.); // Direction of the photon
    
    vec3 color = vec3(0.);
    
    bool disc_sign = dot(pos, disc_norm) > 0.;
    
    // Euler integration
    const int steps = 100;
    for (int i = 0; i < steps; i++) {
        pos += dir * c;
        float dist = length(pos);
        
        dir -= normalize(pos) * photon_inertia / (dist * dist);
        
        bool new_disc_sign = dot(pos, disc_norm) > 0.;
        
        bool crossed_disc = new_disc_sign != disc_sign
            && dist > disc_min_radius
            && dist < disc_max_radius;
        disc_sign = new_disc_sign;
        
        if (crossed_disc) {
            float r = (atan(pos.x, pos.z) + pi) / tau;
            color = vec3(rand(vec2(floor(r * 28. + u_time))));
            break;
        }
        
        if (dist < hole_radius) {
            //color = vec3(0); // Intersects black hole
            break;
        }
    }

    gl_FragColor = vec4(color,1.0);
}
