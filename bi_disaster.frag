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

vec3 bi_flag(float val) {
    const vec3 red = vec3(214, 2, 112) / 255.0;
    const vec3 purple = vec3(155, 79, 150) / 255.0;
    const vec3 blue = vec3(0, 56, 168) / 255.0;
    if (val < 0.45) {
        return red;
    } else if (val < 0.55) {
        return purple;
    } else {
        return blue;
    }
}

vec2 quad_bezier(QuadraticBezier q, float t) {
    return mix(mix(q.start, q.ctrlp, t), mix(q.ctrlp, q.end, t), t);
}

float rand(float n){return fract(sin(n) * 43758.5453123);}
float rand2(float n){return fract(sin(n) * 384.2348923);}

float closest_t(QuadraticBezier q, vec2 pos) {
    float fuzz = 0.;//rand(pos.y + rand2(pos.x)) / 2.5;
    float a = 0. - fuzz;
    float b = 1. + fuzz;
    int ref = int(abs(cos(u_time)) * 8.);
    for (int i = 0; i < 10; i++) {
        float dist_a = length(pos - quad_bezier(q, a));
        float dist_b = length(pos - quad_bezier(q, b));
        float halfway = (a + b) / 2.;
        if (dist_a < dist_b) {
            b = halfway;
        } else {
            a = halfway;
        }
        if (i > ref) {
            break;
        }
    }
    return a + b;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    QuadraticBezier q = QuadraticBezier(
        vec2(0.960,0.070),
        vec2(0.160,0.720),
        vec2(0.090,0.880)
	);
    
    float t = closest_t(q, st);
    vec2 closest_pos = quad_bezier(q, t);
    float dist = length(st - closest_pos);
    vec3 quantized = bi_flag(mod(dist * 4.552, 1.));
    vec3 color = quantized;
    //vec3 color = vec3(dist);
    gl_FragColor = vec4(color,1.0);
}