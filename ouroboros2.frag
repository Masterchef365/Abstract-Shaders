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

mat2 rot2(float r) {
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st = st * 2. - 1.;
    st.y *= u_resolution.y/u_resolution.x;
    
    
    st *= rot2(cos(u_time / 8.) * 0.3);

    bool s = st.x < 0.;
    bool b = false;
    
    const int c = 30;
    
    int z = int(b);
    
    vec3 j = vec3(s);
    
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
        
        float m = float(i) / float(c);
        float k = 2. * PI * m;
        float f = fract(u_time / 10.);
        k += -f * PI * 2.;
        vec2 g = vec2(cos(k), sin(k)) * 0.630;
        g.y *= -0.536;
        float r = mix(0.258, 0.1, m);
        r /= (g.y + 1.512);
        
        bool q = distance(st, g) < r;
        b = b || q;
        
        z += int(q);
        
        vec3 d = mix(vec3(0.901,0.706,1.000), vec3(0.), m);
        float h = 2.0;
        
        if (q) {
            if (s) {
        		j -= (1. - d) / h;
            } else {
                j += d / h;
            }
        }
    }
    
    float u = float(z)/float(5);
    if (s) u = 1. - u;
    vec3 color = vec3(u) * vec3(0.599,0.574,0.940);
    
    
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
