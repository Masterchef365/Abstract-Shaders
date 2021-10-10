// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592;

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

vec3 sgncolor(float p) {
    if (p >= 0.) {
        return p * vec3(0.948,1.000,0.164);
    } else {
        return -p * vec3(1.000,0.106,0.579);
    }
}

float hydrogen(vec3 p) {
    float r = length(p) * 40.144;
    float phi = atan(p.x, p.z);
    float rho = atan(length(p.xz), p.y);
    
    float density = cos(phi) * sin(rho) * cos(rho);
    density *= pow(r/1.840, 3./2.) * pow(r, 2.) * exp(-r / 3.) * sin(rho) * cos(rho) * cos(phi);
	//density -= 0.680;
    
    return density * 3.;
}

vec3 shape(vec3 v) {
    const vec3 pos = vec3(vec2(0.060,0.040), 1.712);
    vec3 p = v - pos;
    p.zx = rot2d(u_time) * p.zx;
    bool inside = rect_prism(p, vec3(0.7));    
    //inside = inside && distance(pos + vec3(0.745,0.000,0.000), v) > 0.840;
    vec3 g = p;
    g.yx *= rot2d(u_time / 2.);
    g.zx *= rot2d(u_time * 2.);
    float density = hydrogen(p - vec3(0.2)) + hydrogen(g + vec3(0.1)) - 3.5;
    vec3 color = sgncolor(density) * vec3(inside) * vec3(0.321,0.504,1.000);
    return color;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x / u_resolution.y;

    const float near = 0.712;
    const float far = 2.800;
    const int iters = 200;
    const float step = (far - near) / float(iters);
    
    vec3 ray = normalize(vec3(st, 1.));
    vec3 pos = ray * near;
    vec3 color = vec3(0.);
    
    for (int i = 0; i < iters; i++) {
        color += shape(pos);
        pos += ray * step;
    }
	color /= float(far - near) * float(iters);
    //color /= (far - near);

    gl_FragColor = vec4(color,1.0);
}

