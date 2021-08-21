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

bool quadratic(float a, float b, float c, out float p, out float q) {
    // Check for any intersection
    float g = b * b - 4. * a * c;
    if (g < 0.) {
        return false;
    }
    
    // Decide closest intersection 
	float a2 = 2. * a;
    float j = -b / a2;
    float k = sqrt(g) / a2;
    p = j + k;
    q = j - k;
	return true;
}

vec3 shape(vec3 v) {
    const vec3 pos = vec3(vec2(0.060,0.040), 1.616);
    vec3 p = v - pos;
    p.zx = rot2d(-14.128) * p.zx;
    bool inside = rect_prism(p, vec3(0.7));
    float k, q;
    inside = inside && quadratic(p.x, p.y, p.z, k, q);
    
    vec3 color = abs(vec3(k, q, (k + q) / 10.));
    color *= float(inside);
    return color;
}

void main() {
    vec2 st = norma(gl_FragCoord.xy/u_resolution.xy);

    const float near = 1.0;
    const float far = 2.0;
    const int iters = 190;
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

