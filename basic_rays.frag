// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

struct Ray {
	vec3 pos;
	vec3 dir;
};

float sum3(vec3 v) { return v.x + v.y + v.z; }

bool sphere(inout Ray ray, inout float dist, vec3 pos, float r) {
    vec3 normal = pos - ray.pos;
    float a = sum3(ray.dir * ray.dir);// always 1! dot(normal, normal) = 1
    float b = -2. * sum3(ray.dir * normal);
    float c = dot(pos, pos) - r * r;
    
	// Check for any intersection
    float g = b * b - 4. * a * c;
    if (g < 0.) {
        return false;
    }
    
    // Decide closest intersection 
	float a2 = 2. * a;
    float q = -b / a2;
    float k = sqrt(g) / a2;
    
    float t = min(q + k, q - k);
    if (t < dist) {
        dist = t;
        ray.pos += ray.dir * t;
        vec3 incident = pos - ray.pos;
        ray.dir = reflect(incident, normal);
        return true;
    } else {
        return false;
    }
}

vec3 sample(vec2 pos) {
    vec2 st = (pos/u_resolution.xy) * 2. - 1.;
    Ray ray = Ray(vec3(0.), normalize(vec3(st, 1.)));
    
    vec3 color = vec3(0.);
    
    float dist = 999999999999999.;
    if (sphere(ray, dist, vec3(0., 0., 2.), 1.)) {
        color = vec3(1.);
    }
    //color = vec3(dist);

    return color;
}

void main() {
    const int AA_DIVS = 0;
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
