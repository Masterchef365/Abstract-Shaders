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
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    st.x += cos(st.y*3.)/3.;

    float x_scale = st.x * 28.;
    float chunky = floor(x_scale);
    int phase = int(mod(floor(x_scale), 3.));
    float thinny = fract(x_scale);
    float r1 = rand(vec2(chunky, 3.));
    float r2 = rand(vec2(chunky, 4.));
    
    float g = st.y + u_time * r2 * 0.3;
    vec3 color = vec3(fract(g) < 0.5) * vec3(thinny < 0.5);
    color -= float(phase == 0) * (1. - vec3(1.000,0.985,0.067));
    color -= float(phase == 1) * (1. - vec3(1.000,0.434,0.000));
    color -= float(phase == 2) * (1. - vec3(0.005,0.349,1.000));

    gl_FragColor = vec4(color,1.0);
}
