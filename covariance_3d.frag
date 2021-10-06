// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float pi = 3.141592; // We like pi
const float tau = pi * 2.; // But tau is better

vec2 norma(vec2 v) {
    return v * 2. - 1.;
}

mat2 rot2d(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
} 

bool rect_prism(vec3 p, vec3 size) {
    return all(greaterThan(p, -size)) && all(lessThan(p, size));
}


mat3 inverse(mat3 m, out float det) {
  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

  float b01 = a22 * a11 - a12 * a21;
  float b11 = -a22 * a10 + a12 * a20;
  float b21 = a21 * a10 - a11 * a20;

  det = a00 * b01 + a01 * b11 + a02 * b21;

  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

// Probability that x is encountered with the given covariance matrix
float px(vec3 x, float det_cov, mat3 inv_cov) {
    return pow(det_cov * tau, -.5) * exp(-.5 * dot(x, inv_cov * x));
}

vec3 shape(vec3 v, float det_cov, mat3 inv_cov) {
    const vec3 pos = vec3(vec2(0.060,0.040), 1.616);
    vec3 offset = v - pos;
    offset.zx *= rot2d(-14.912);
    vec3 color = vec3(px(offset, det_cov, inv_cov)) * vec3(rect_prism(offset, vec3((0.680))));
    return color;
}

void main() {
    vec2 st = norma(gl_FragCoord.xy/u_resolution.xy);

    const float near = 1.0;
    const float far = 2.0;
    const int iters = 50;
    const float step = (far - near) / float(iters);
    const int brightness = 3;
    
    mat3 covariance = mat3(
        1., 0., 0.,
        0., 1., 0.,
        0., 0., 1.
    ) / 18.;
    float det_cov;
    mat3 inv_cov = inverse(covariance, det_cov);
    
    vec3 ray = normalize(vec3(st, 1.));
    vec3 pos = ray * near;
    vec3 color = vec3(0.);
    
    for (int i = 0; i < iters; i++) {
        color += shape(pos, det_cov, inv_cov);
        pos += ray * step;
    }
	color /= float(iters / brightness);

    gl_FragColor = vec4(color,1.0);
}

