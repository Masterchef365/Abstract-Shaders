// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
const float PI = 3.141592;

float distfunc(vec2 pos, float x) {
    return length(pos - vec2(x, cos(x)));
}


const int REFINEMENTS = 12;
float find_smallest(vec2 pos) {
    float a = pos.x - PI;
    float b = pos.x + PI;
    for (int i = 0; i < REFINEMENTS; i++) {
        float dist_a = length(pos - distfunc(pos, a));
        float dist_b = length(pos - distfunc(pos, b));
        float halfway = (a + b) / 2.;
        if (dist_a < dist_b) {
            b = halfway;
        } else {
            a = halfway;
        }
    }
    return distfunc(pos, a);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 20.;
    st -= 10.;

	float dist = find_smallest(st);
    vec3 color = vec3(dist < 0.148);

    gl_FragColor = vec4(color,1.0);
}