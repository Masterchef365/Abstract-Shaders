// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159274;

vec3 to_threespace(vec2 st) {
    const vec2 a = vec2(1., 0.);
    const vec2 b = vec2(cos(pi / 3.), sin(pi / 3.));
    const vec2 c = vec2(cos(2. * pi / 3.), sin(2. * pi / 3.));
    return vec3(
        dot(st, a),
        dot(st, b),
        dot(st, c)
    );
}

vec2 from_threespace(vec3 threespace) {
    return vec2(threespace.x, (threespace.y + threespace.z) / sqrt(3.));
}

bool floor_color(int layer, vec2 uv, inout vec3 color, const int layers) {
    bvec2 a = lessThan(fract(uv), vec2(.5));
    bool stop = a.x != a.y;
    if (stop) {
        float r = float(layer) / float(layers);
        color = mix(
            mix(vec3(0.), vec3(0.007,0.314,0.970), r),
            mix(vec3(0.068,0.199,1.000), vec3(1.), r),
            r
        );
    }
    return stop;
    
}

vec3 weird_floor(vec3 ray_pos, vec3 ray_dir, const float y, const float sep) {
    const int steps = 8;
    
    vec3 color = vec3(0.);
    for (int i = 0; i < steps; i++) {
        float layer_y = sep * float(i) * float(i);
        float y_rel = ray_pos.y - y + layer_y;
        float dist = y_rel / ray_dir.y;
        vec2 sample_pos = ray_dir.xz * dist + ray_pos.xz;
        if (floor_color(i, sample_pos, color, steps)) break;
    }
    return color;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;

    const float fov = 1. / 1.2;
    vec3 ray_pos = vec3(0., (1.), 0.);
    vec3 ray_dir = vec3(st, fov);
    
    vec3 color = vec3(0.);
    if (ray_dir.y < 0.) { // TODO: Comment this out in vr??
        color = weird_floor(ray_pos, ray_dir, 0., 1.);
    }
    

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
