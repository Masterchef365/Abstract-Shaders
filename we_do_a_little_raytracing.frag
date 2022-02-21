// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int AA_DIVS = 1;
const int MAX_BOUNCES = 10;

const int MAT_DIFFUSE = 0;
const int MAT_GLOSSY = 1;
const int MAT_EMISSIVE = 2;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.425);
}

vec3 rand3(vec3 co) {
    return vec3(
        rand(co.xy),
        rand(co.yz),
        rand(co.zx)
    );
}

// Poor approximation of unit sphere
vec3 rand_unit_sphere(vec3 co) {
    vec3 pick = rand3(co);
    vec3 norm = normalize(pick);
    float mag = length(pick);
    return cos(mag * 8.4) * norm;
}

// A ray from the scene
struct Ray {
    // Origin
    vec3 orig;
    // Direction
    vec3 dir;
};

// A record of a past hit
struct Hit {
    // Postion along the input ray  
    float t;
    // Normal of the object
    vec3 normal;
    // Material of the object
    int material;
};

// Calculate the position of a hit
vec3 calc_hit_pos(in Ray r, in Hit hit) {
    return r.orig + r.dir * hit.t;
}

Ray bounce_diffuse(in Ray r, in Hit hit) {
    vec3 hit_pos = calc_hit_pos(r, hit);
    vec3 target = hit_pos + hit.normal + rand_unit_sphere(hit.normal);
    return Ray(hit_pos, target - hit_pos);
}

Ray bounce_glossy(in Ray r, in Hit hit) {
    vec3 hit_pos = calc_hit_pos(r, hit);
    return Ray(hit_pos, hit.normal);
}

// Calculate a ray-sphere intersection.
bool hit_sphere(in Ray r, in vec3 center, float radius, out Hit hit) {
    vec3 oc = r.orig - center;
    float a = dot(r.dir, r.dir);
    float b = 2.0 * dot(oc, r.dir);
    float c = dot(oc, oc) - radius*radius;
    float discriminant = b*b - 4.*a*c;
    bool is_hit = discriminant > 0.;
    hit.t = (-b - sqrt(discriminant)) / (2. * a);
    hit.normal = normalize(calc_hit_pos(r, hit) - center);
    return is_hit;
}

// Sky color
vec3 sky(in Ray r) {
    return mix(vec3(1.), vec3(.5, .7, 1.), clamp(r.dir.y, 0., 1.));
}

bool scene_cons(bool b, int mat, in Hit tmp_hit, inout Hit out_hit, inout float min_t) {
    bool is_hit = b && tmp_hit.t > 0. && tmp_hit.t < min_t;
    if (is_hit) {
        tmp_hit.material = mat;
        out_hit = tmp_hit;
        min_t = tmp_hit.t;
    }
    return is_hit;
}

bool scene(in Ray r, out Hit out_hit) {
    Hit tmp_hit;
    float min_t = 9e9;
    
	bool a = scene_cons(hit_sphere(r, vec3(0.), 1., tmp_hit), MAT_EMISSIVE, tmp_hit, out_hit, min_t);
    
    bool c = false;
    const int sp = 10;
    for (int i = 0; i < sp; i++) {
        float k = float(i) / float(sp);
    	c = c || scene_cons(hit_sphere(r, vec3(vec2(-14.,0.0), 14.552) * k, 1., tmp_hit), int(mod(float(i), 3.)), tmp_hit, out_hit, min_t);
    }
        
    const float k = 5000.;
	bool b = scene_cons(hit_sphere(r, vec3(0., -k - 1., 0.), k, tmp_hit), MAT_DIFFUSE, tmp_hit, out_hit, min_t);
    
    return a || b || c;
}

vec3 pixel(vec2 coord) {
    vec2 st = (coord/u_resolution.xy) * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    const float fov = 1. / 0.908;
    const vec3 cam_pos = vec3(0., 0., -4.);
	vec3 dir = vec3(st, fov);
    
    Ray r = Ray(cam_pos, dir);
    Hit hit;
    Hit bounces[MAX_BOUNCES];
    int n_bounces = 0;
    
    for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
        if (scene(r, hit)) {
            bounces[bounce] = hit;
            n_bounces++;
            if (hit.material == MAT_DIFFUSE) {
            	r = bounce_diffuse(r, hit);
            } else if (hit.material == MAT_GLOSSY) {
            	r = bounce_glossy(r, hit);
            } else if (hit.material == MAT_EMISSIVE) {
                break;
            }
        } else {
            break;
        }
    }

    vec3 color = sky(r);
    for (int bounce = MAX_BOUNCES; bounce >= 0; bounce--) {
        if (bounce >= n_bounces) continue;
        int mat = bounces[bounce].material;
        if (mat == MAT_DIFFUSE) {
        	color *= .9;
        } else if (mat == MAT_EMISSIVE) {
            color = vec3(1.);
        }
    }
    
    //color = vec3(n_bounces) / vec3(MAX_BOUNCES);
    
    return color;
}

// Apply antialiasing
void main() {
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
