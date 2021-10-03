// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rot2d(float r) {
    return mat2(
        cos(r), sin(r),
        -sin(r), cos(r)
    );
}

// https://iquilezles.org/www/articles/boxfunctions/boxfunctions.htm
bool box_intersect(in vec3 dir, in vec3 pos, in vec3 size, out float near, out float far) {
  
    
    vec3 m = 1.0/dir;
    vec3 n = m*pos;
    vec3 k = abs(m)*size;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

    near = max( max( t1.x, t1.y ), t1.z );
    far = min( min( t2.x, t2.y ), t2.z );

    return !(near>far || far<0.0);
}

vec3 shape(vec3 p) {
    return (p + 1.) / 2.;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. -1.;

    const float fov = 1.;
    vec3 ray_dir = normalize(vec3(st, fov));
    vec3 ray_pos = vec3(vec2(0), 0.);
    vec3 color = vec3(0.);
    
    const vec3 box_pos = vec3(vec2(0.), 3.080);
    const vec3 box_size = vec3(1);
    
    mat2 r = rot2d(1.);
    
    vec3 box_ray_dir = ray_dir;
    box_ray_dir.xz *= r;
    
	vec3 box_ray_pos = ray_pos - box_pos;
    box_ray_pos.xz *= r;
    
    float near, far;
    if (!box_intersect(box_ray_dir, box_ray_pos, box_size, near, far)) {
        return color;
    }
    
    const int iters = 3;
    for (int i = 0; i < iters; i++) {
        float j = float(i) / float(iters);
        vec3 pos = mix(near, far, j) * ray_dir;
        pos -= box_pos;
        pos.xz *= r;
        color += shape(pos);
    }
    color /= float(iters);

    return color;
}

void main() {
    vec3 color = pixel(gl_FragCoord.xy);
    gl_FragColor = vec4(color,1.0);
}
