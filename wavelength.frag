// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float triangle(float x) {
    return abs(fract(x + .5) - .5) * 2.;
}

// https://github.com/hughsk/glsl-hsv2rgb/blob/master/index.glsl
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 wavelength_color(float nm) {
    const float min_nm = 380.;
    const float max_nm = 750.;
    const float cutoff = 0.154;
    nm = clamp(nm, min_nm, max_nm);
    float normalized = (nm - min_nm) / (max_nm - min_nm);
  	float hue = 0.840 - normalized * 0.9;
    float value = min(triangle(normalized), cutoff) / cutoff;
    return hsv2rgb(vec3(hue, 1., value));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    const float min_nm = 380.;
    const float max_nm = 750.;
    
    vec3 color = vec3(0.);
    color = vec3(wavelength_color(st.x * (max_nm - min_nm) + min_nm));

    gl_FragColor = vec4(color,1.0);
}
