/*mat4.translate = function(a, b, c) {
	var d = b[0], e = b[1];
	b = b[2];
	if(!c ||a == c) {
		a[12] = a[0] * d + a[4] * e + a[8] * b + a[12];
		a[13] = a[1] * d + a[5] * e + a[9] * b + a[13];
		a[14] = a[2] * d + a[6] * e + a[10] * b + a[14];
		a[15] = a[3] * d + a[7] * e + a[11] * b + a[15];
		return a;
	}
	var g = a[0], f = a[1], h = a[2], i = a[3], j = a[4], k = a[5], l = a[6], o = a[7], m = a[8], n = a[9], p = a[10], r = a[11];
	c[0] = g;
	c[1] = f;
	c[2] = h;
	c[3] = i;
	c[4] = j;
	c[5] = k;
	c[6] = l;
	c[7] = o;
	c[8] = m;
	c[9] = n;
	c[10] = p;
	c[11] = r;
	c[12] = g * d + j * e + m * b + a[12];
	c[13] = f * d + k * e + n * b + a[13];
	c[14] = h * d + l * e + p * b + a[14];
	c[15] = i * d + o * e + r * b + a[15];
	return c;
}*/

mat3.translate = function(a, b, c) {
	var d = b[0];
	b = b[1];
	if(!c ||a == c) {
		a[6] = a[0] * d + a[3] * b + a[6];
		a[7] = a[1] * d + a[4] * b + a[7];
		a[8] = a[2] * d + a[5] * b + a[8];
		return a;
	}
	var f = a[0], g = a[1], h = a[2], i = a[3], j = a[4], k = a[5];
	c[0] = f;
	c[1] = g;
	c[2] = h;
	c[3] = i;
	c[4] = j;
	c[5] = k;
	c[6] = f * d + i * b + a[6];
	c[7] = g * d + j * b + a[7];
	c[8] = h * d + k * b + a[8];
	return c;
}

/*mat3.toMat4 = function(a, b) {
	b || (b = mat4.create());
	b[0] = a[0];
	b[1] = a[1];
	b[2] = a[2];
	b[3] = 0;
	b[4] = a[3];
	b[5] = a[4];
	b[6] = a[5];
	b[7] = 0;
	b[8] = a[6];
	b[9] = a[7];
	b[10] = a[8];
	b[11] = 0;
	b[12] = 0;
	b[13] = 0;
	b[14] = 0;
	b[15] = 1;
	return b;
}*/

/*vec3.add = function(a, b, c) {
	if(!c || a == c){
		a[0] += b[0];
		a[1] += b[1];
		a[2] += b[2];
		return a;
	}
	c[0] = a[0] + b[0];
	c[1] = a[1] + b[1];
	c[2] = a[2] + b[2];
	return c;
}

vec3.subtract = function(a, b, c) {
	if(!c || a == c) {
		a[0] -= b[0];
		a[1] -= b[1];
		a[2] -= b[2];
		return a
	}
	c[0] = a[0] - b[0];
	c[1] = a[1] - b[1];
	c[2] = a[2] - b[2];
	return c;
}*/

vec3.multiply = function(a, b, c) {
	if(!c || a == c){
		a[0] *= b[0];
		a[1] *= b[1];
		a[2] *= b[2];
		return a;
	}
	c[0] = a[0] * b[0];
	c[1] = a[1] * b[1];
	c[2] = a[2] * b[2];
	return c;
}

vec3.divide = function(a, b, c) {
	if(!c || a == c){
		a[0] /= b[0];
		a[1] /= b[1];
		a[2] /= b[2];
		return a;
	}
	c[0] = a[0] / b[0];
	c[1] = a[1] / b[1];
	c[2] = a[2] / b[2];
	return c;
}