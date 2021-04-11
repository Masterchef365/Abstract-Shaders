// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float zoom = 80.0;
const float line_width = 4. / zoom;
const int pattern = 8;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    // Scaling
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    //st.x += 1.;
    st = (st * 2. - 1.) * zoom;
    float x = st.x;
    float y = st.y;
    const float pi = 3.141592;
    
    
    float v = cos(x);
    for (int i = 1; i < pattern; i++) {
        float prog = float(i) / float(pattern);
        float desc = pi * prog;// + u_time / 20.;
        v += cos(y*sin(desc) + x*cos(desc));
    }
    
    // Coloring
    //vec3 color = mix(vec3(0.319,0.141,0.600), vec3(0.192,0.509,1.000), avg);
    //vec3 color = vec3(avg > 0.756);
    //vec3 color = vec3(v > .5);
    //float steps = 12.;
    //v /= 10.;
    //vec3 color = hsv2rgb(vec3(float(int(v * steps)) / steps, 1.0, 1.)); // UNCOMMENT FOR RAINBOWS
    vec3 color = vec3(0);
    if (v > 0.580) {
        color = vec3(1.000,0.214,0.407);
    } else if (v > -1.108) {
        color = vec3(0.);
	} else if (v > -3.896) {
        color = vec3(0.975,0.552,0.343);
    }
    
    
    gl_FragColor = vec4(color, 1.);
}
