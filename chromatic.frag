#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/max(u_resolution.x, u_resolution.y);
    //vec2 st = gl_FragCoord.xy/u_resolution;

    bool q = true;
    float v = 0.;
    const int steps = 10;
    for (int i = 0; i < steps; i++) {
        q = q != fract((st.x + st.y) * float(i)) < .5;
        q = q != fract((-st.x + st.y) * float(i)) < .5;//(cos(u_time / 2.) + 1.) / 2.;
        v += (1. / float(steps)) * float(q);
    }
    
    vec3 color = hsv2rgb(vec3(v + 0.068, 0.8, 1.));
    
    gl_FragColor = vec4(color,1.0);
}
