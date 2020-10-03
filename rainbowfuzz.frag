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

float rand(float n){return fract(sin(n) * 43758.5453123);}
float rand2(float n){return fract(sin(n) * 892384.2348923);}

const int REFINEMENTS = 9;
float closest_t(QuadraticBezier q, vec2 pos) {
    float a = rand(pos.x + rand2(pos.y)) / 10.0;
    float b = 1.0 + rand(pos.x + rand2(pos.y)) / 10.0;
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
        vec2(0.130,0.110),
        vec2(0.060,0.750)
	);
    
    float t = closest_t(q, st);
    vec2 closest_pos = quad_bezier(q, t);
    float dist = length(st - closest_pos);
    float quantized = floor(dist * 41.880 + -0.116) / 8.584;
    vec3 color = vec3(hsv2rgb(vec3(quantized + 0.072, 1., 1.)));
    gl_FragColor = vec4(color,1.0);
}