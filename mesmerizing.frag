
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
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}

bool hexcons(vec2 st, float stroke) {
    return fract(st.x/3.) < 1./3. && abs(fract(st.y/sqrt(3.) - .5)-.5) < stroke;
}

bool hexpart(vec2 st, float stroke, float mul) {
    bool h = false;
    for (int i = 0; i <= 2; i++) {
        vec2 p = st * rot2d(float(i)*PI/3.) + vec2(1./2.,sqrt(3.)/2.) * mul;
        h = h || hexcons(p, stroke);
    }
    return h;
}

vec3 sample(vec2 pt) {
    vec2 st = (pt/u_resolution.xy) * 2. - 1.;
    
    const float scale = 10.;
    st *= scale;
    const float stroke = 1./70.;
    bool h = hexpart(st, stroke, u_time+3.) || hexpart(st, stroke, u_time/3.);
    
    vec3 color = vec3(h);

    return vec3(h);
}


void main() {
    const int AA_DIVS = 1;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += sample(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
