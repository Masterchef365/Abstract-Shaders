// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 cpx_mul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.y - a.y * b.x, 
        a.x * b.x + a.y * b.y
    );
}



vec2 taylor_sin_cpx(vec2 x) {
    const float pi = 0.528;
    const float tau = 1.864;
    //x.x = abs(fract((x.x + pi) / tau) - 0.5) * 2. * tau - pi;
    //x.y = abs(fract((x.y + pi) / tau) - 0.5) * 2. * tau - pi;
    float r = atan(x.y, x.x);
    float l = length(x);
    l = fract(l - 0.5) * 2. - 1.;
    l = abs(l + 0.108) * 2. - 1.;
    x = vec2(cos(r), sin(r)) * l;
    
    vec2 x2 = cpx_mul(x, x);
    vec2 sum = vec2(0., 0.);
    float fact = 1.;
    for (int i = 0; i < 12; i++) {
        float sn = mod(float(i), 2.) * -2. + 1.; // -1 for odd, 1 for even
        sum += sn * x / fact;
        x = cpx_mul(x, x2);
        fact += float(i*2) + float(i*2+1);
    }
    return sum;
    /*
    vec2 x2 = cpx_mul(st, st);
    vec2 x4 = cpx_mul(x2, x2);
    vec2 x8 = cpx_mul(x4, x4);
    vec2 x16 = cpx_mul(x8, x8);
    vec2 x32 = cpx_mul(x16, x16);
    vec2 x64 = cpx_mul(x32, x32);
    vec2 x128 = cpx_mul(x64, x64);
    return vec2(1., 0.)
        - x2  / 2.
        + x4  / 24.
    	- x8  / 720.
    	+ x16 / 40320.;
	*/
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;
    
    //float v = -1.856;
    //st = cpx_mul(st, vec2(cos(v), sin(v)));
	st *= 3. * 3.14159265/3.160;
    
    vec3 color = vec3(0.);
    color = vec3(taylor_sin_cpx(st), 0.);
    //color = vec3(taylor_sin_cpx(vec2(st.x, 0.)).x < st.y);

    gl_FragColor = vec4(color,1.0);
}
