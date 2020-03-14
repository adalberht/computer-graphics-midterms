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