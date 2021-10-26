// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// This is an attempt at re-creating an album cover:
// https://www.youtube.com/watch?v=zPBqn_AqCE0

// https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

float cross2d(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    st += (vec2(
        rand(st * vec2(-0.710,0.720)) * 100.,
        rand(st * vec2(0.920,-0.810)) * 100.
	) * 2. - 1.) * 0.0001;
        
    vec3 color = vec3(0.);
    const vec2 dir = vec2(0.910,0.630);
    float grad_x = dot(st, dir) * 2.;
    float grad_y = (cross2d(st, dir) + 0.072 / 2.);
    int index = int(grad_x);
    
    float stripes = fract(grad_x);
    
    if (fract(grad_x / 2.) < .5) grad_y *= -1.;
    color = mix(vec3(0.895,0.538,0.227), vec3(0.940,0.074,0.571), grad_y * 1.4 + 0.504);

    float sel = rand(vec2(index) + 0.528) * 0.204 + .1;
    if (stripes < sel) {
        color = mix(color, vec3(1.), pow(fract(grad_x * 4.928), 2.) * 3.);
    }

    gl_FragColor = vec4(color,1.0);
}
