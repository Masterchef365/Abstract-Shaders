
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float turn = -10.080;
bool shape(vec3 p) {
    return p.y < exp(-p.z / p.x);
    //return all(greaterThan(fract(p * 3.), vec3(.5)));
}

mat2 rot2d(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
}

vec3 box(vec3 v) {
    const vec3 pos = vec3(0., 0., 2.5);
    vec3 p = v - pos;
    p.xz = rot2d(turn) * p.xz;
    const float size = 1.000; 
    bool cube_inside = 
        all(greaterThan(p, vec3(-size))) && 
        all(lessThan(p, vec3(size)));

	p = (p + 1.) / 2.;    
	bool fn_inside = shape(p);
    bool inside = cube_inside && fn_inside;
    return vec3(inside) * p;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;

    const float near = 1.0;
    const float far = 4.0;
    const int iters = 10;
    const float step = (far - near) / float(iters);
    const int brightness = 4;
    
    vec3 ray = normalize(vec3(st, 1.));
    vec3 pos = ray * near;
    vec3 color = vec3(0.);
    
    for (int i = 0; i < iters; i++) {
        color += box(pos);
        pos += ray * step;
        if (length(color) > 0.) {
            break;
        }
    }
	//color /= float(iters / brightness);

    gl_FragColor = vec4(color,1.0);
}
