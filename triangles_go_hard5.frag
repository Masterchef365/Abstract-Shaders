// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.14159265;
const float tau = pi * 2.;
const float tau3 = tau / 3.;

// https://www.shadertoy.com/view/MtjBWR
vec3 hcl2rgb(vec3 hcl) {
    float H = hcl.x;
    float C = hcl.y;
    float L = hcl.z;
    // https://en.wikipedia.org/wiki/HSL_and_HSV#From_luma/chroma/hue
    float hPrime = H / 60.0;
    float X = C * (1.0 - abs(mod(hPrime, 2.0) - 1.0));
    vec3 rgb = (
        hPrime < 1.0 ? vec3(C, X, 0) :
        hPrime < 2.0 ? vec3(X, C, 0) :
        hPrime < 3.0 ? vec3(0, C, X) :
        hPrime < 4.0 ? vec3(0, X, C) :
        hPrime < 5.0 ? vec3(X, 0, C) :
        vec3(C, 0, X)
    );
    
    float m = L - dot(vec3(0.3, 0.59, 0.11), rgb);
    return rgb + vec3(m, m, m);
}

float rand(vec3 co){
    return fract(sin(dot(co, vec3(12.9898, 78.233, 34.34289))) * 43758.5453);
}

const vec2 a = vec2(cos(tau3 * 0.), sin(tau3 * 0.));
const vec2 b = vec2(cos(tau3 * 1.), sin(tau3 * 1.));
const vec2 c = vec2(cos(tau3 * 2.), sin(tau3 * 2.));

vec3 to_threespace(vec2 v) {
	return vec3(
        dot(v, a),
        dot(v, b),
        dot(v, c)
    );
}

mat2 rot2(float r) {
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}

float stepthing(float x) {
    return floor(x/2.) + fract(x) * float(fract(x/2.) > 0.5);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;
    
      
    st *= rot2(0.308);
    
    st *= 2.;
    
    st.y += 1./sqrt(3.) * stepthing(u_time / 3.) * float(fract(st.x) < 0.5);
  
    
    vec3 th = to_threespace(st);
    
    vec3 ki = th;
    int j = 1;
    for (int i = 1; i <= 5; i++) {
    	if (rand(floor(ki)) < 0.28) {
            break;
        } else {
            ki *= 2.;
            ki += 10.;
        }
        j = i;
    }
    
    th = floor(th * pow(2., float(j)));
    
    vec3 color = hcl2rgb(vec3(
        rand(th) * 3. + 0.,
        rand(th.rbg),
        rand(th.brg)
    ));

    gl_FragColor = vec4(color,1.0);
}
