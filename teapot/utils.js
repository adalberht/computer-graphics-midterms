"use strict";

function round(num, precision = 2) {
  return Math.round(num * 10 ** precision) / 10 ** precision;
}

function numEquals(num1, num2, precision = 2) {
  if (typeof num1 !== typeof num2) return false;
  return round(num1, precision) === round(num2, precision);
}

/**
 * Generic mathematical equality comparison method but only compare up to {precision}
 * Modified version of {equal} in MV.js
 *
 * @param {Matrix/Vector} u
 * @param {Matrix/Vector} v
 * @param {number} precision
 */
function equals(u, v, precision = 2) {
  if (u.length != v.length) {
    return false;
  }
  if (u.matrix && v.matrix) {
    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        return false;
      }
      for (var j = 0; j < u[i].length; ++j) {
        if (!numEquals(u[i][j], v[i][j], precision)) {
          return false;
        }
      }
    }
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    return false;
  } else {
    for (var i = 0; i < u.length; ++i) {
      if (!numEquals(u[i], v[i], precision)) {
        return false;
      }
    }
  }
  return true;
}

