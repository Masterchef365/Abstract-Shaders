// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.14159265;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st * 2. - 1.;

    bool b = true;//st.x < 0.;
    
    const int c = 40;
    
    for (int i = 0; i < c; i++) {
     	/*
        float t = u_time / 20. + float(i) / float(c);
        
        vec2 v[2];
        vec2 p[2];
        
        for (int j = 0; j < 2; j++) {
            int l = i * 80 + j + int(t);
            
            p[j] = (vec2(
                rand(vec2(l, 0.5)),
                rand(vec2(l, 0.156))
            ) * 2. - 1.) * 1.75;

            float v_d = rand(vec2(l, 1.004)) * PI;
            v[j] = vec2(cos(v_d), sin(v_d)) * 0.1;
        }
        
        vec2 g = mix(
      		mix(p[0], p[0] + v[0], fract(t)),
            mix(p[1] + v[1], p[1], fract(t)),
            fract(t)
        );
        
        float r = 0.2;//rand(vec2(i));
        */
        
        float r = 2. * PI * float(i) / float(c);
        r += -fract(u_time / 10.) * PI;
        vec2 g = vec2(cos(r), sin(r));
        
        b = b != distance(st, g) < r;
    }
    
    vec3 color = vec3(b);
    
    return color;
}

void main() {
    const int AA_DIVS = 0;
    const int AA_WIDTH = AA_DIVS*2+1;
    vec3 color = vec3(0.);
 	for (int x = -AA_DIVS; x <= AA_DIVS; x++) {
        for (int y = -AA_DIVS; y <= AA_DIVS; y++) {
        	vec2 off = vec2(x, y) / float(AA_WIDTH);
            color += pixel(off + gl_FragCoord.xy);
        }
    }
    color /= float(AA_WIDTH*AA_WIDTH);
    gl_FragColor = vec4(color, 1.);
}
