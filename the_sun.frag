// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 pos = gl_FragCoord.xy/u_resolution.xy;
    vec2 st = pos;
    st.y = abs(st.y * 2. - 1.);
    const vec2 a = vec2(0.370,0.600);
    const vec2 b = vec2(1.000,-0.280);
    
    // Water randomizes x positions
    bool water = pos.y < .5 + cos(st.x * 150. + u_time * 3.) * -0.003 * sin(u_time * 2.);
    if (water) {
        st.x -= (rand(vec2(pos.y)) * 2. - 1.) * pow(1. - pos.y, 8.904);
    }
    
    vec2 sun_pos = mix(a, b, (cos(u_time / 5.) + 1.) / 2.);
    float dist = length(((st - sun_pos) * vec2(2., 1.)));

    vec3 sun_color = mix(vec3(1.000,0.539,0.234), vec3(0.890,0.153,0.609), dist);
    vec3 background = mix(vec3(0.248,0.980,1.200), vec3(0.979,1.000,0.481), st.y);
   	vec3 color;
    if (dist < .5) {
        color = sun_color;
        // Reflection darkens underneath
    } else {
		color = background;
    }
    if (water) color *= 0.9 - st.y;

    gl_FragColor = vec4(color,1.0);
}
