"use strict";

var step = 0.1;

var bound = 2.0;

/**
 *
 * @param {int} order
 * @param {Vec3} stepVector
 * @param {Vec3} maxMovementVector: the max movement vector that marks the end of one animation state
 */
function AnimationState(order, stepVector, maxMovementVector) {
  this.order = order;
  this.stepVector = stepVector;
  this.maxMovementVector = maxMovementVector;
  return this;
}

function AnimationController() {
  this.currentStateOrder = 0;
  this.movementVector = vec3(0, 0, 0);
  this.disabled = false;
  return this;
}

AnimationController.states = [
  new AnimationState(1, vec3(0.0, 0.0, +step), vec3(0.0, 0.0, bound)), // goes to front direction
  new AnimationState(2, vec3(0.0, 0.0, -step), vec3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(3, vec3(0.0, 0.0, -step), vec3(0.0, 0.0, -bound)), // goes to behind
  new AnimationState(4, vec3(0.0, 0.0, +step), vec3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(5, vec3(+step, 0.0, 0.0), vec3(bound, 0.0, 0.0)), // goes to right
  new AnimationState(6, vec3(-step, 0.0, 0.0), vec3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(7, vec3(-step, 0.0, 0.0), vec3(-bound, 0.0, 0.0)), // goes to left
  new AnimationState(8, vec3(+step, 0.0, 0.0), vec3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(9, vec3(0.0, +step, 0.0), vec3(0.0, bound, 0.0)), // goes to up
  new AnimationState(10, vec3(0.0, -step, 0.0), vec3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(11, vec3(0.0, -step, 0.0), vec3(0.0, -bound, 0.0)), // goes to down
  new AnimationState(12, vec3(0.0, +step, 0.0), vec3(0.0, 0.0, 0.0)) // back to origin
];

AnimationController.prototype.forward = function() {
  var currentState = AnimationController.states[this.currentStateOrder];
  this.movementVector = add(this.movementVector, currentState.stepVector);
  if (equals(this.movementVector, currentState.maxMovementVector)) {
    this.currentStateOrder = (this.currentStateOrder + 1) % AnimationController.states.length; // cyclic
  }
};

AnimationController.prototype.toggleDisabled = function() {
    this.disabled = !this.disabled;
    return this.disabled;
}
