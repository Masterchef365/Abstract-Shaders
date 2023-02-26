// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 sgncolor(float r);

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;
    
    st *= 3.;

    vec2 a = vec2(1, -1);
    vec2 b = vec2(-0.380,0.880);
    vec2 c = vec2(-0.440,-0.530);
    vec2 d = vec2(-0.710,0.560);
    
    float da = distance(a, st) * 1.;
    float db = distance(b, st) * -1.080;
    float dc = distance(c, st) * -0.816;
    float dd = distance(d, st) * 1.;

    float v = da + db + dc + dd;
    
    vec3 color = vec3(fract((v /  + 0.5) * 6. + u_time) < 0.2) * sgncolor(v);
    //color = vec3(abs(v));
    if (abs(da) < 0.1) color = vec3(1.);
    if (abs(db) < 0.1) color = vec3(1.);
    if (abs(dc) < 0.1) color = vec3(1.);
    if (abs(dd) < 0.1) color = vec3(1.);

    gl_FragColor = vec4(color,1.0);
}

vec3 sgncolor(float r) {
    r *= 3.;
    if (r < 0.) {
        return vec3(0., 0.1, 1.) * -r;
    } else {
        return vec3(1., 0.1, 0.) * r;
    }
}
