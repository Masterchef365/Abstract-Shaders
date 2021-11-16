// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;
const float tau = 2. * pi;
const float frac_tau_3 = tau / 3.;
const vec2 a = vec2(cos(0.), sin(0.));
const vec2 b = vec2(cos(frac_tau_3), sin(frac_tau_3));
const vec2 c = vec2(cos(2. * frac_tau_3), sin(2. * frac_tau_3));
const float base_height_ratio = 2. / sqrt(3.);

vec3 tri_tile(vec2 uv) {
    return vec3(
    	dot(uv, a),
        dot(uv, b),
        dot(uv, c)
    );
}

vec3 quantize(vec3 x, float parts) {
    return floor(x * parts) / parts;
}

float quantize(float x, float parts) {
    return floor(x * parts) / (parts - 1.);
}

float rand(float x) {
    return fract(sin((x + 892.792) * 44.538) * 3.168);
}

float slopestep(float x, float slope) {
    return min(fract(x) * slope, 1.) + float(int(x));
}

float lin_slopestep(float x, float part) {
    return slopestep(x / part, part);
}

const int ITERS = 3;
float marble(vec2 pos) {
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    vec2 q = vec2(0.);
    float g = 0.;
    for (int i = 0; i < ITERS; i++) { 
        float m = float(i);
    	q += cos(st * vec2(1. - m, 1.720 * m) + q.yx);
        q = q + dot(q, vec2(0.440,-0.420));
        g += abs(q.x) - abs(q.y);
        if (abs(q.x) < 0.02 || abs(q.y) < 0.021) break;
    }
    return g;
}

vec3 pixel(vec2 coord) {
    vec2 orig = (coord/u_resolution.xy) * 2. - 1.;
    orig.x *= u_resolution.x/u_resolution.y;
    
    vec2 st = orig;
    
    const float sz = 13.648;
    
    vec3 pre = floor(tri_tile(st) * sz);
    const float p = 0.09;
    bool red = rand(float(pre.x) * 78.848) < p;
    bool green = rand(float(pre.y) * 758.512) < p;
    bool blue = rand(float(pre.z) * 468.848) < p;
    
    float anim = u_time;
    const float parts = 5.;
    
    float anim_a = lin_slopestep(anim + 0., parts);
    float anim_b = lin_slopestep(anim + 1.5, parts);
    float anim_c = lin_slopestep(anim + 3.5, parts);
    anim_a = anim_b = anim_c = u_time;
    
    green = green && !red;
    blue = blue && !red && !green;
    if (red) st += a.yx * base_height_ratio * anim_a / sz;
    if (green) st += c.yx * base_height_ratio * anim_b / sz;
    if (blue) st += b.yx * base_height_ratio * anim_c / sz;

	vec3 tri = floor(tri_tile(st) * sz);
    
    vec2 rand_off = vec2(
        rand(tri.x * tri.y * tri.z + 422.847),
        rand(tri.x * tri.y + tri.z * 422.847)
    );
    
    vec2 slide = rand_off + orig;
    
    vec3 color = vec3(slide, 0);

    
    return color;
}

void main() {
    const int AA_DIVS = 1;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += pixel(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
