// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

// returns a/b
vec2 cpx_div(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x
    );
}

// Return e^(i*r)
vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

// Naively computes (a + bi)^p
vec2 cpx_pow(vec2 ab, float p) {
    return unit_circ(atan(ab.y, ab.x) * p);
}

// returns a*b
vec2 cpx_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x + a.y * b.y,
        a.y * b.x - a.x * b.y
    ) / dot(b, b);
}

// returns e^(a + bi)
vec2 cpx_exp(vec2 ab) {
    return exp(ab.x) * unit_circ(ab.y);
}

// https://en.wikipedia.org/wiki/Wave_packet
// Compute a wave packet solution to Schrödinger equation,
// in polar coordinates
vec2 wave_packet(vec2 r, float t, vec2 a) {
    vec2 at = a + vec2(0, t);
    vec2 rr_cpx = vec2(dot(r, r), 0.);
    return cpx_mul(
        cpx_pow(cpx_div(a, at), 3. / 2.),
        cpx_exp(cpx_div(rr_cpx, 2. * at))
    );
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 r = st;
    
    vec2 wv = wave_packet(r, fract(u_time) * pi * 2., vec2(0.530,0.830));
	
    vec3 color = vec3(wv, 0).rbg;

    gl_FragColor = vec4(color,1.0);
}
