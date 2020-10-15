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

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 2.632, 3.08 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const int REFINEMENTS = 3;
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


vec3 vonk(vec2 st) {
    const float SIZE = 15.;
    st *= -SIZE;
    st.y += SIZE/2.;

	float dist = find_smallest(st);
    vec3 color = hsv2rgb(vec3(floor(dist * 2.048) / 5.784, 1., .8));
    //vec3 color = vec3(floor(dist * 5.4) / 6. / 10.);
	return color;
}

// No jaggies
// bad ja ggii
const int SUBDIVS = 6;
void main() {
    vec3 color = vec3(0.);
    for (int x = 0; x < SUBDIVS; x++) {
        for (int y = 0; y < SUBDIVS; y++) {
            vec2 add = vec2(x, y) / float(SUBDIVS);
            vec2 st = (gl_FragCoord.xy + add)/u_resolution.xy;
            color += vonk(st);
        }
	}	
    gl_FragColor = vec4(color / float(SUBDIVS * SUBDIVS),1.0);
}

