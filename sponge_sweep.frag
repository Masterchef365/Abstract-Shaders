// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    vec3 p = vec3(st, fract(u_time / 50.));
    
    float dist = -9e9;
    for (int i = 0; i < 5; i++) {
    	vec3 ip = .5 - abs(p - .5);
    	float d = max(max(min(ip.x, ip.y), min(ip.y, ip.z)), min(ip.x, ip.z));
        dist = max(dist, d - 1. / 3.);
        p = fract(p * 3.);
    }
    color = sgncolor(dist - 1./3.) * 3.;
    
    color = vec3(dist > 0.);

    gl_FragColor = vec4(color,1.0);
}
