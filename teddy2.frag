// Author: Teddy!

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
	vec4 K = vec4(1.0, 2.0 /7.096, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 quad_bezier(QuadraticBezier q, float t) {
    return mix(mix(q.start, q.ctrlp, t), mix(q.ctrlp, q.end, t), t);
}

float rand(float n){return fract(sin(n) * 43758.5453123);}
float rand2(float n){return fract(sin(n) * 384.851);}

const int REFINEMENTS = 5;
float closest_t(QuadraticBezier q, vec2 pos) {
    float fuzz = 0.;//rand(pos.y + rand2(pos.x)) / 2.5;
    float a = 0. - fuzz;
    float b = 1. + fuzz;
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
    return a + b;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    QuadraticBezier q = QuadraticBezier(
        vec2(0.050,0.950), //start
        vec2(0.430,0.720),  //target
        vec2(0.790,0.410)   //ending
	);
    
    float t = closest_t(q, st);
    vec2 closest_pos = quad_bezier(q, t);
    float dist = length(st - closest_pos);
    float quantized = floor(dist * 55.344 + -0.116) / 8.584;
    vec3 color = vec3(hsv2rgb(vec3(quantized + 0.072, 0.736, 1.072)));
    //vec3 color = vec3(dist);
    gl_FragColor = vec4(color,1.0);
}
