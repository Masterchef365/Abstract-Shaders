// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//const vec2 a = vec2(0.010,0.800);
//const vec2 b = vec2(0.180,0.220);
//const vec2 c = vec2(0.780,0.350);

const vec2 a = vec2(0.110,0.940);
const vec2 b = vec2(-0.790,-0.690);
const vec2 c = vec2(0.690,-0.680);

bool vec_left(vec2 pt, vec2 start, vec2 end) {
    vec2 p = pt - start;
    vec2 e = end - start;
    return p.x * e.y < p.y * e.x;
}

bool triangle(vec2 pt, vec2 a, vec2 b, vec2 c) {
    return vec_left(pt, a, b) &&
        vec_left(pt, b, c) &&
        vec_left(pt, c, a);
}

mat2 rot2d(float t) {
    return mat2(
        cos(t), -sin(t),
        sin(t), cos(t)
    ); 
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.;
    st -= 1.;

    
    vec3 color = vec3(0.);
    
    const int iters = 15;
    //float spread = u_time / 2.;
    vec2 pt = st.xy;
    for (int i = 0; i < iters; i++) {
        vec2 tri_pt = pt;
    	vec2 col_pt = pt;
        float r = float(i) * spread / float(iters) + 0.;
        tri_pt = rot2d(r * 1.) * tri_pt;
        if (triangle(tri_pt, a, b, c)) {
            col_pt = rot2d(r * -5.) * pt;
            color += vec3(
                distance(col_pt, a),
                distance(col_pt, b),
                distance(col_pt, c)
            ) / float(iters);
        }
    }

    gl_FragColor = vec4(color, 1.);
}
