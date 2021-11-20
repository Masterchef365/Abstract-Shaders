// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Voronoi
// Also do nested tick tack toe thing

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(vec2 co){
  	return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rand2(vec2 co) {
    return vec2(
        rand(co),
        rand(co * vec2(-0.750,0.660))
    );
}


vec2 unit_circ(float r) {
    return vec2(cos(r), sin(r));
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    //st += cos(cos(st.yx * 8. + st * 12.) + u_time) * .05;
    //st += rand2(st) * .01;

    float anim = u_time;
    vec3 color = vec3(0.);
    float thick;
    float min_dist = 0.264;// * fract(u_time / 10.);
    float last_angle = 0.;
    for (int i = 1; i <= 140; i++) {
        vec2 node = rand2(vec2(i));
        vec2 params = rand2(vec2(i) * 3.);
        
        vec2 pos = st + vec2(cos(anim * params.x + params.y * 83.), sin(anim + params.x * 83.)) * params * .1;
        
        float d = distance(node, pos);
        vec2 k = node - pos;
        float angle = atan(k.y, k.x);
        
        
        if (d < min_dist) {
            //color = hsv2rgb(vec3(float(i) / 9.536, 1, 1));
        	float ad = d - cos((angle + last_angle)) * 0.142;
            thick = abs(min_dist - ad);	
            min_dist = d;
        }

        last_angle = angle;
        
        //if (d < 0.005) color = vec3(1.);
    }
    
    return color + mix(
        vec3(0.005,0.018,0.030), 
        vec3(0.485,0.856,0.990), 
        float(thick < 0.005)
    );
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
