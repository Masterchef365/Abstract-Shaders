// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 circ(vec2 st, vec2 pos, vec3 color, float radius) {
    float len = length(st - pos);
    return (1. - color) * float(len < radius) * mix(-0.776, 0.920, len / radius);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233 + u_time))) * 43758.5453);
}

vec3 figure(vec2 st, vec2 seed) {
    vec3 color = mix(vec3(1.000,0.903,0.834), vec3(0.925,0.759,0.705), rand(st));
    st += cos((st.x + st.y + u_time / 50.) * 20.184) * vec2(rand(st + 4.)) / 10.;
    color -= circ(st, vec2(0.410,0.290), vec3(1.000,0.709,0.323), 0.576);
    color -= circ(st, vec2(-0.360,0.320), vec3(1.000,0.192,0.683), 0.576);
    color -= circ(st, vec2(0.010,-0.350), vec3(0.480,1.000,0.981), 0.576);
    return color;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 rate = 1. / u_resolution.xy;
    st *= 2.000;
    st -= 1.;
    st /= 2.5;
    
    vec2 seed = st;
    
    vec3 color = vec3(0.);
        
    color += figure(st + vec2(0., 0.), seed);
    color += figure(st + vec2(rate.x, 0.), seed);
	color += figure(st + vec2(0., rate.y), seed);
    color += figure(st + vec2(rate.x, 0.), seed);
    
    color /= 4.;

    gl_FragColor = vec4(color,1.0);
}

