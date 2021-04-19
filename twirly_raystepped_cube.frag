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

vec3 shape(vec3 v) {
    const vec3 pos = vec3(vec2(0.060,0.040), 1.616);
    vec3 p = v - pos;
    p.zx = rot2d(u_time) * p.zx;
    //bool inside = distance(pos, v) < 0.624 != distance(pos, v) < 0.584;
    const float size = 0.700; 
    bool inside = 
        all(greaterThan(p, vec3(-size))) && 
        all(lessThan(p, vec3(size)));
    inside = inside && distance(pos + vec3(0.745,0.000,0.000), v) > 0.840;
    //bool inside = length(p) < 0.508;
    return vec3(inside) * p;
    //return vec3(distance(pos.xy, v.xy) < 0.4 && abs(v.z - pos.z) < 0.172);
}

void main() {
    vec2 st = norma(gl_FragCoord.xy/u_resolution.xy);

    const float near = 1.0;
    const float far = 2.0;
    const int iters = 50;
    const float step = (far - near) / float(iters);
    const int brightness = 3;
    
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