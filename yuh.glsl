// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.141592653589793;

mat2 rot2d(float r) {
    return mat2(
        cos(r), sin(r),
        -sin(r), cos(r)
    );
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

int collatz(int c) {
    const int max_steps = 500;
    int r;
    for (int i = 0; i < max_steps; i++) {
        if (mod(float(c), 2.) == 0.) {
            c /= 2;
        } else {
            c = 3 * c + 1;
        }
        r = i;
        if (c == 1) break;
    }
    return r;
}

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;

    vec3 color = vec3(0.);
    const int steps = 151;
    //bool forg = false;
    int forg = 1;
    float q;
    for (int i = 0; i < steps; i++) {
        float f = float(i) / float(steps);
        float rads = f * PI;
        vec2 normf = vec2(cos(rads), sin(rads));
		vec2 normst = normalize(st);
        float anim = fract(-u_time / 100.);
        bool cmp = dot(normst, normf) > anim * 2. - 1.;
        //forg = forg != cmp;
        if (cmp) forg += 1;
        st *= rot2d(f);
        st += normf * f * f * 0.716;
    }
    
    //int c = collatz(forg);
    float c = rand(vec2(4.495, float(forg)));
    
    //color = vec3(st, 0.);
    color = vec3(c) / 1.;
    //color = vec3(forg) / 60.;

    gl_FragColor = vec4(color,1.0);
}

// TODO: Switch to micro-engine so that you can use vim
// Also include fakeouts for the u_* things, making it easier to import your old projects
