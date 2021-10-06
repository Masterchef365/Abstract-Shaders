// Author: Duncan Freeman
// Title: Covariance matrix visualizer
// Displays the probability density at each point in 2D space given a covariance matrix

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Change me!
// If you click on a variable, you can use the slider 
// that appears under it to adjust the values
const mat2 covariance = mat2(
    1., 0., 
    0., 1.
);

const float pi = 3.141592; // We like pi
const float tau = pi * 2.; // But tau is better

// Compute the determinant of a 2x2 matrix
float det(mat2 m) {
    return m[0][0]*m[1][1] - m[0][1]*m[1][0];
}

// Invert a 2x2 matrix
mat2 inverse(mat2 m) {
  	return mat2(m[1][1], -m[0][1], -m[1][0], m[0][0]) / det(m);
}

// Probability that x is encountered with the given covariance matrix
float px(vec2 x, mat2 cov) {
    return pow(det(cov) * tau, -.5) * exp(-.5 * dot(x, inverse(cov) * x));
}

// Display probability
void main() {
    // Operate from -2 to 2 for both coordinates X and Y
    vec2 st = (gl_FragCoord.xy/u_resolution.xy) * 2. - 1.;
    st *= 2.;
	
    vec3 color = vec3(px(st, covariance));

    gl_FragColor = vec4(color,1.0);
}
