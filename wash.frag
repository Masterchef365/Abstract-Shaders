// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
const float PI = 3.141592 / 2.;

float distfunc(vec2 pos, float x) {
    return length(pos - vec2(x, cos(x)));
}

vec3 hsv2rgb(vec3 c, float y) {
	vec4 K = vec4(1.0, 2.0 / 2., 3.08 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const int REFINEMENTS = 5;
float find_smallest(vec2 pos) {
    float a = pos.x - PI/2.;
    float b = pos.x + PI/2.;
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
    //return a;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    const float SIZE = 30.;
    st *= -SIZE;
    st.y += SIZE/2.;

	float dist = find_smallest(st);
    vec3 color = hsv2rgb(vec3(floor(dist * 1.) / 10., 1., .9), cos(dist / 8.));
    //vec3 color = vec3(floor(dist * 5.4) / 6. / 10.);

    gl_FragColor = vec4(color,1.0);
}