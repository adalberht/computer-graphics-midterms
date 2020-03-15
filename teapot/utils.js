function round(num, precision = 2) {
  return Math.round(num * 10 ** precision) / 10 ** precision;
}

function equals(num1, num2, precision = 2) {
  if (typeof num1 !== typeof num2) return false;
  return round(num1, precision) === round(num2, precision);
}

// Vector 3 definition
function V3(x = 0, y = 0, z = 0) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
}

V3.prototype = {
  get value() {
    return [this.x, this.y, this.z];
  }
};

V3.prototype.add = function(another) {
  if (!(another instanceof V3)) return this;
  this.x += another.x;
  this.y += another.y;
  this.z += another.z;
  return this;
};

V3.prototype.equals = function(another) {
  if (!(another instanceof V3)) return false;
  return (
    equals(this.x, another.x) &&
    equals(this.y, another.y) &&
    equals(this.z, another.z)
  );
};
