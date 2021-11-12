#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    
    const float scale = 2.;
    vec2 frac = fract(st * vec2(1., 2.) * scale);

    vec3 color = vec3(mix(
        frac.y, 
        1. - frac.y, 
        float(frac.x > .5)
    ));

    gl_FragColor = vec4(color, 1.);
}
