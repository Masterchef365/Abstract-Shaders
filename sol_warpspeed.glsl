
// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

/*bool stripey(vec2 st) {
    return fract(st.x * 3.168) < 0.5;
}*/

float stripey(vec2 st) {
    return float(int(st.x * pow(st.y, cos(u_time))));
}

mat2 rot2d(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
}

float rand3d(in vec3 v) {
    return cos(length(v) * 10.) / 1.;
    return fract(sin(dot(
        v + vec3(72.272,60.540,342.000), 
        vec3(35.673,93.321,65.406)))
    * 339.518);
}

const float PI = 3.141592;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2. - 1.;
    st *= 5.440;

    vec3 color = vec3(0.);
    mat2 rot_a = rot2d(2.*PI/3.);
    mat2 rot_b = rot2d(-2.*PI/3.);
    
    float v = rand3d(vec3(
        stripey(st),
        stripey(rot_a * st),
        stripey(rot_b * st)
    ));
    
    //v = (cos(v * v * u_time) + 1.) / 2.; // Animate
    
    const vec3 color_a = vec3(1., 1., 0.);
    const vec3 color_b = vec3(0.094,1.000,0.436);
    const vec3 color_c = vec3(0., 0.3, 1.);
    
    color = vec3(mix(
        mix(color_a, color_b, v),
        mix(color_b, color_c, v),
        v
    ));

    gl_FragColor = vec4(color,1.0);
}
