// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.141592;
const float TAU = 2. * PI;

bool shape(vec2 st, int petals) {
    float angle = (atan(st.y, st.x) + PI) / TAU;
    return length(st) < (abs(fract(angle * float(petals)) - 0.5) + 0.5) / 1.168;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 2.;
    st -= 1.;

    float angle = (atan(st.y, st.x) + PI) / TAU;
    bool s = shape(st, 8);
    s =  shape(st, 8);
    vec3 color = mix(
        vec3(1.000,0.182,0.707), 
        vec3(0.950,0.893,0.025), 
        float(int(angle * 16.)) / 16.
    );
    color -= float(!s) * -0.380;
    //color = vec3( < st.y);

    gl_FragColor = vec4(color,1.0);
}
