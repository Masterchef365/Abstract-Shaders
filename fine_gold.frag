// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.14159265;

vec2 unit_circ(float r) {
	return vec2(cos(r), sin(r));
}

vec3 trispace(vec2 p) {
    return vec3(
        dot(p, unit_circ(0. * PI / 3.)),
        dot(p, unit_circ(1. * PI / 3.)),
        dot(p, unit_circ(2. * PI / 3.))
    );
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;

    float k = 0.50;
    vec3 t = trispace(st) * k;
    
    vec3 color = vec3(0);
    int y = 0;
    const int iters = 9;
    for (int i = 0; i < iters; i++) {
        vec3 f = fract(t);
    	vec3 g = floor(t) / k;
        if (f.x > 0.5 != f.y > 0.5 != f.z > 0.5) {
        	color = vec3(1.);
            y += 1;
            //break;
        }
        t *= 2.;
    }
   	float h = float(y)/float(iters);
    color = hsv2rgb(vec3(h, cos(h*-3.472), sin(h)));
    color = pow(color, vec3(0.699,1.051,2.000));
    //color = vec3(2.000,0.780,0.414) * pow(h * 1.036, 2.);
    
    gl_FragColor = vec4(color,1.0);
}
