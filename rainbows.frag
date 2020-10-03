// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

struct QuadraticBezier {
	vec2 start;
	vec2 ctrlp;
    vec2 end;
};

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 quad_bezier(QuadraticBezier q, float t) {
    return mix(mix(q.start, q.ctrlp, t), mix(q.ctrlp, q.end, t), t);
}

const int REFINEMENTS = 9;
float closest_t(QuadraticBezier q, vec2 pos) {
    float a = 0.0;
    float b = 1.0;
    for (int i = 0; i < REFINEMENTS; i++) {
        float dist_a = length(pos - quad_bezier(q, a));
        float dist_b = length(pos - quad_bezier(q, b));
        float halfway = (a + b) / 2.;
        if (dist_a < dist_b) {
            b = halfway;
        } else {
            a = halfway;
        }
    }
    return b;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    QuadraticBezier q = QuadraticBezier(
        vec2(0.800,0.180),
        vec2(0.830,0.910),
        vec2(0.060,0.750)
	);
    
    float t = closest_t(q, st);
    vec2 closest_pos = quad_bezier(q, t);
    float dist = length(st - closest_pos);
    float quantized = floor(dist * 40.) / 10.;
    vec3 color = vec3(hsv2rgb(vec3(quantized + u_time, 1., 1.)));
    gl_FragColor = vec4(color,1.0);
}