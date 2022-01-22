// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float cmin(vec2 v) {
    return min(v.x, v.y);
}

float cmin(vec3 v) {
    return min(min(v.x, v.y), v.z);
}

float cmax(vec2 v) {
    return max(v.x, v.y);
}

float cmax(vec3 v) {
    return max(max(v.x, v.y), v.z);
}

vec3 sgncolor(float x) {
    if (x > 0.) {
        return x * vec3(1., 0.1, 0.1);
    } else {
        return -x * vec3(0.1, 0.1, 1.1);
    }
}

// Takes values of 0 to 1 for xyz, outputs a signed distance value
float menger_sponge(vec3 p) {
    const int iters = 2;
    float m = 9e9; // Initialize way out of bounds
    for (int i = 0; i < iters; i++) {
        // Calc manhattan distance from center
        m = cmax(abs(p - .5));
        
        // Signed distance function
        m = abs(m * 2. - 2./3.) * 3./2. - .5;
        
        // Recursively tile 3x3
        p = fract(p * 3.); 
        
        // Early exit if inside
        if (m > 0.) {
            break;
		}
    }
    return m;
}

// Returns true if inside the cube
bool inside_cube(vec3 p, out float dist, vec3 size) {
    bool outside = all(greaterThan(p, -size)) && all(lessThan(p, size));
    dist = distance(p, clamp(p, -size, size));
    return outside;
}

// Menger sponge with seperate inside/out
float friendly_cube(vec3 p) {
    float dist;
    if (inside_cube(p, dist, vec3(1))) {
        dist = menger_sponge((p + 1.) / 2.);
    }
    return dist;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 p = vec3(st, fract(u_time / 10.) * 2. - 1.);
    p *= 2.;
    vec3 color = vec3(sgncolor(friendly_cube(p)));

    gl_FragColor = vec4(color,1.0);
}
