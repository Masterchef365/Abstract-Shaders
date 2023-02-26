// Author: Duncan Freeman
// Title: Polarizing filter experiment simulation

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI = 3.141592653589793;

// vec4 are kets (psi = k.xy|+> + k.zw|+>)
// vec2 are complex numbers (c = c.x + i*c.y)

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Multiply complex numbers
vec2 cpx_mul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, 
        		a.x * b.y + a.y * b.x);
}

// Complex conjugate
vec2 conj(vec2 c) {
    return vec2(c.x, -c.y);
}

// Multiply u* by v
vec2 braket(vec4 u, vec4 v) {
    return cpx_mul(conj(u.xy), v.xy)
         + cpx_mul(conj(u.zw), v.zw);
}

// Complex squared magnitude; |z|^2
float cpx_sqr_mag(vec2 z) {
    return dot(z, z);
}

// Normalize the given vector
vec4 vect_norm(vec4 k) {
    return k / length(braket(k, k));
}

// Bloch sphere
vec4 bloch(float theta, float phi) {
    return vec4(
        vec2(cos(theta/2.), 0),
        sin(theta/2.) * vec2(cos(phi), sin(phi))
    );
}

// Calculate probability of the given braket
float prob(vec4 u, vec4 v) {
    return cpx_sqr_mag(braket(u, v));
}

// Probability of being in the positive spin state
float prob(vec4 u) {
    return u.x * u.x;
}

// Multiply the complex vector by the complex scalar
vec4 cpx_scalar_mul(vec4 u, vec2 c) {
    return vec4(cpx_mul(u.xy, c), cpx_mul(u.zw, c));
}

// Apply the given measurement
vec4 operate(vec4 u, vec4 v) {
    return cpx_scalar_mul(v, braket(u, v));
}

// Spin X in the z-basis
const vec4 spin_x_pos = vec4(vec2(1., 0.), vec2(1., 0.)) / sqrt(2.);
const vec4 spin_x_neg = vec4(vec2(1., 0.), vec2(-1., 0.)) / sqrt(2.);

// Spin Y in the z-basis
const vec4 spin_y_pos = vec4(vec2(1., 0.), vec2(0., 1.)) / sqrt(2.);
const vec4 spin_y_neg = vec4(vec2(1., 0.), vec2(0., -1.)) / sqrt(2.);

// Spin Z in the z-basis
const vec4 spin_z_pos = vec4(vec2(1., 0.), vec2(0., 0.));
const vec4 spin_z_neg = vec4(vec2(0., 0.), vec2(1., 0.));

// Rotation matrix
mat2 rot2(float r) {
    return mat2(
        cos(r), -sin(r),
        sin(r), cos(r)
    );
}

// Square at the given pose
bool square(vec2 st, float angle) {
    st *= rot2(angle);
    return all(lessThan(abs(st), vec2(0.8, 0.3)));
}

// Apply a polarizing filter to the state
vec4 polarizer(vec2 st, float angle, vec4 psi) {
    if (square(st, angle)) {
        return operate(psi, bloch(PI/2., angle*2.));
    } else {
        return psi;
    }
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 pixel(vec2 coord) {
    vec2 st = coord/u_resolution.xy;
    st = st * 2. - 1.;
    st.x *= u_resolution.x/u_resolution.y;
    
    st /= 2.;
    
    // Uncomment to get a simulation of individual particles
    /*vec4 psi = vect_norm(vec4(
        rand(st * vec2(0.290,0.940)),
        rand(st * vec2(-0.590,-0.280)),
        rand(st * vec2(-0.840,0.570)),
		rand(st * vec2(0.570,-0.660))        
    ) * 2. - 1.);*/

    // Our "light table" has a polarization in the z-direction 
    vec4 psi = spin_z_pos;
    
    // All filters have polarization in the xy plane.
    // Apply a horizontal filter
    psi = operate(psi, bloch(PI/2., u_time));
    
    st /= dot(st, st);
    
	psi = operate(psi, bloch(st.x * PI, st.y * PI));
    
    // Measure probability with respect to the z axis 
    // (and boost the gain a bit so it's easier to see)
    float p = sqrt(prob(psi, spin_z_pos));
    p *= 3.416;
    float k = 4.;
    p = floor(p * k) / k;
    vec3 color = vec3(hsv2rgb(vec3(p * 3. + 0.140, 1, 1.)));

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
