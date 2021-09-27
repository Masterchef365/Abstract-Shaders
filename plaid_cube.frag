// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 norma(vec2 v) {
    return v * 2. - 1.;
}

mat2 rot2d(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
} 

bool rect_prism(vec3 p, vec3 size) {
    return all(greaterThan(p, -size)) && all(lessThan(p, size));
}

const vec3 red = vec3(214, 2, 112) / 255.0;
const vec3 purple = vec3(155, 79, 150) / 255.0;
const vec3 blue = vec3(0, 56, 168) / 255.0;

bool double_stripe(vec3 k, int slats, float low, float hi) {
    bvec3 j = greaterThan(k, vec3(low));
    bvec3 p = lessThan(k, vec3(hi));
    return 
        (j.x && p.x && slats == 0) 
        || (j.y && p.y && slats == 1)
        || (j.z && p.z && slats == 2);
}

vec3 plaid(vec3 st) {
    vec3 f = fract(st);
    vec3 k = abs(f - 0.5) * 1.20;
    
    //bool slats = fract((st.x + st.y) * 45. + u_time) < 0.5;
	int slats = int(fract((st.x + st.y) * 45.) * 3.);

    vec3 color = red;
    
    const float b1l = 0.156;
    const float b1h = 0.364;
    const float b1c = (b1l + b1h) / 2.;
    
    const float miniwidth = 0.01;
	
    bool black1 = double_stripe(k, slats, b1l, b1h);
    bool black2 = double_stripe(k, slats, 0.03, 0.03 + miniwidth);
    
    bool center = double_stripe(k, slats, 0.0, miniwidth);
    
    const float sep = 0.03;
    const float bc1off = b1c - sep;
    const float bc2off = b1c + sep;
    bool blackcenter1 = double_stripe(k, slats, bc1off, bc1off + miniwidth);
    bool blackcenter2 = double_stripe(k, slats, bc2off, bc2off + miniwidth);
    
    bool black = black2 || black1;
    bool blackcenter = blackcenter1 || blackcenter2;
	
    if (black) color = vec3(0.);
    if (blackcenter || center) color = vec3(1.);
    
    bvec3 j = greaterThan(k, vec3(bc2off));
    bvec3 p = lessThan(k, vec3(bc2off + miniwidth));
    
    if (j.y && p.y && slats == 1) color = vec3(1., 1., 0.);

    return color;
}

vec3 shape(vec3 v) {
    const vec3 pos = vec3(vec2(0.060,0.040), 1.616);
    vec3 p = v - pos;
    p.zx *= rot2d(2.624);
    p.xy *= rot2d(-3.408);
    bool inside = rect_prism(p, vec3(0.7));    
    //inside = inside && distance(pos + vec3(0.745,0.000,0.000), v) > 0.840;
    vec3 color = vec3(inside) * plaid(p);
    return color;
}

void main() {
    vec2 st = norma(gl_FragCoord.xy/u_resolution.xy);

    const float near = 1.0;
    const float far = 2.0;
    const int iters = 80;
    const float step = (far - near) / float(iters);
    const int brightness = 1;
    
    vec3 ray = normalize(vec3(st, 1.));
    vec3 pos = ray * near;
    vec3 color = vec3(0.);
    
    for (int i = 0; i < iters; i++) {
        color += shape(pos);
        pos += ray * step;
    }
	color /= float(iters / brightness);

    gl_FragColor = vec4(color,1.0);
}

