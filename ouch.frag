// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand2d(in vec2 v) {
    const vec3 seed = vec3(677.237,490.549,832.127);
    return fract(sin(dot(v / seed.zx, seed.xy)) * seed.z);
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    
    const vec2 planet_pos = vec2(0.0,-1.008 * 8.);
    const float planet_radius = -planet_pos.y - 0.696;
    bool planet = distance(st, planet_pos) < planet_radius;

    float s = 40. + cos(u_time);
    vec3 color = vec3(rand2d(vec2(ivec2(st * s)) / s) < 0.1);
    if (planet)
    color = vec3(planet);

    gl_FragColor = vec4(color, 1.0);
}
