// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float noodle(vec2 st, float period, float amplitude, float speed, float width) {
    return float(abs(cos(st.x + u_time * period) * amplitude - st.y) < width);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st -= .5;
    st *= 2.336;
    

    vec3 color = vec3(0.);
    for (int i = 0; i < 20; i++) {
        vec3 fire = mix(vec3(0.415,0.262,0.073), vec3(0.340,0.051,0.229), cos(float(i * 5)));
        color += noodle(st, float(i) / 20., 1., 1., .1) * fire;
    }

    gl_FragColor = vec4(color,1.0);
}
