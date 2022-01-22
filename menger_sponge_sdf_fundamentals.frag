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
    const int iters = 4;
    float m = 9e9; // Initialize way out of bounds
    for (int i = 0; i < iters; i++) {
        // Calculate signed distance for X and Y
        m = cmax(abs(p - vec3(.5)) - vec3(1. / 6.));
        
        // Recursively tile 3x3
        p = fract(p * 3.); 
        
        // Early exit if inside
        if (m < 0.) {
            break;
		}
    }
    return m;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(sgncolor(menger_sponge(vec3(st, fract(u_time / 20.)))) * 2.);

    gl_FragColor = vec4(color,1.0);
}
