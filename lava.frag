// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43757.953);
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    float min_dist = 9e99;
    
    for (int i = 0; i < 200; i++) {
        vec2 pt = vec2(
            rand(vec2(i, 3423.3242)),
            rand(vec2(84392., i))
        ) * 2. - 1.;
        
        vec2 source = vec2(0.350,0.330);
        if (i > 100) {
            source = vec2(0.790,0.400);
        }
        float source_dist = distance(st, source);
        
        pt = mix(source, source + pt, fract(u_time / 10. + cos(pt.x) * 88.));

        /*vec3 c = vec3(
            rand(vec2(i, 342.3242)),
            rand(vec2(8492., i)),
            rand(vec2(84392., 342  * i))
        );*/
        
        float dist = distance(st, pt);
        if (dist < min_dist) {
            //color = c;
            color = vec3(0.015,0.021,0.030);
            
            float thresh = 0.001 / clamp(pow(source_dist * 2., 3.), 0.2, 8.);
            
            if (min_dist - dist < thresh) {
                color = vec3(1.000,0.159,0.140);
            }
            min_dist = dist;
        }
        /*if (dist < 0.01) {
            color = vec3(1);
        }*/
    }

    return color;
}

void main() {
    const int AA_DIVS = 1;
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
