// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// This is an attempt at re-creating an album cover:
// https://www.youtube.com/watch?v=zPBqn_AqCE0

// https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

float cross2d(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}

vec2 rand2d(vec2 coord, const vec2 seed) {
    return vec2(
        rand(coord * seed.xy),
        rand(coord * seed.yx)
    );
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	
    // Foreground
    vec3 color = vec3(0.);
    
    // Frosted glass effect
    vec2 frost = st + (vec2(
        rand(st * vec2(-0.710,0.720)),
        rand(st * vec2(0.920,-0.810))
	) * 2. - 1.) * vec2(0.01, 0.005);
    
    // The extent of st on two dimensions

    const vec2 dir = vec2(0.910,0.630);
    float grad_x = dot(frost, dir) * 2.;
    float grad_y = (cross2d(frost, dir) + 0.072 / 2.);
    int index = int(grad_x);
    
    // Alternating stripes
    float stripes = fract(grad_x);
    if (fract(grad_x / 2.) < .5) grad_y *= -1.;
    
    // Background gradient
    color = mix(
        vec3(0.895,0.538,0.227), 
        vec3(0.940,0.074,0.571), 
        grad_y * 1.4 + 0.504
    );
    
    // White stripes
    float sel = rand(vec2(index) + 0.528) * 0.204 + .1;
    if (stripes < sel) {
        color = mix(
            color, 
            vec3(1.), 
            pow(fract(-grad_x * 6.112), 1.376) * 1.984);
    }
    
    // Center thing
    float dist = 1000000.;
    for (int i = 1; i <= 48; i++) {
        vec2 a = normalize(rand2d(vec2(i), vec2(-0.560,0.300)));
    	vec2 pos = rand2d(vec2(i), vec2(-0.430,0.250)) * 2. - 1.;
        pos *= vec2(0.500,0.150);
        vec2 off = st * 2. - 1. - pos;
        float k = max(abs(dot(off, a)), abs(cross2d(off, a)));
        dist = min(dist, k);
        //dist = max(dist, k);
    }
    
    const float thresh = 0.060;
    if (dist < thresh) {
        color = mix(
            vec3(0.827,1.000,0.149), 
            vec3(0.169,0.577,0.960), 
            st.x * 3. - 1.208
        );
    	//color = vec3(dist / 0.068);
    }

    gl_FragColor = vec4(color,1.0);
}
