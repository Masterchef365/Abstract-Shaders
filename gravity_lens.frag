// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void mass(inout vec3 ray_dir, in vec3 ray_pos, vec3 pos, float mass) {
       vec3 pos_diff = ray_pos - pos;
        float dist_sq = dot(pos_diff, pos_diff);
        vec3 influence_dir = normalize(pos_diff);
        ray_dir = normalize(ray_dir + influence_dir * mass / dist_sq);
} 

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st = st * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    const float fov = 1. / 0.736;
    const float clip_near = 0.001;
    const float warp_const = 1.;
    
    //vec3 unit_ray_dir = normalize(vec3(st, fov));
    //vec3 ray_dir = unit_ray_dir;
    //vec3 ray_pos = unit_ray_dir * clip_near;
    
    vec3 unit_ray_dir = vec3(0., 0., 1.);
    vec3 ray_dir = unit_ray_dir;
    vec3 ray_pos = vec3(st, 0.);
    
    const int steps = 8;
    for (int step = 0; step < steps; step++) {
        float m = fract(u_time / 20.) * 2.;
     	mass(ray_dir, ray_pos, vec3(vec2(0), 1.0), m * m);
        //mass(ray_dir, ray_pos, vec3(vec2(-0.100,-0.290), 1.024), 1. / 1000000.);
        //mass(ray_dir, ray_pos, vec3(vec2(-0.460,0.060), 1.500), 1. / 1000000.);
        ray_pos += ray_dir;
    }
    
    const float line_width = 0.762;
    const float ncells = 8.;
    vec2 cells = ray_pos.xy * ncells;
    vec2 f = fract(cells);
    vec2 corner = vec2(ivec2(cells)) / ncells;
    
    vec3 color = vec3(abs(corner), 0.) / 2.;
    if (f.x < line_width || f.y < line_width) color = vec3(0);
    return color;
}

void main() {
    const int AA_DIVS = 3;
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
