// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    ivec2 pix = ivec2(gl_FragCoord.xy);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(1.);
    //float v = rand(vec2(float(int(st.y * 10.)), st.x));
    int lane = int(st.y * 30.);
   // float v = rand(vec2(ivec2(st * vec2(0.200,0.970) * 20.)));
    float v = rand(vec2(lane, int((st.x + float(lane) * u_time / 100.) * 10.)));
    color = mix(vec3(0.088,0.768,1.000), vec3(0.), v);

    //color -= v;
    gl_FragColor = vec4(color,1.0);
}
