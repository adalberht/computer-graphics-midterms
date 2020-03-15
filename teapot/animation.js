var step = 0.01;

/**
 *
 * @param {int} order
 * @param {V3} stepVector
 * @param {V3} maxMovementVector: the max movement vector that marks the end of one animation state
 */
function AnimationState(order, stepVector, maxMovementVector) {
  this.order = order;
  this.stepVector = stepVector;
  this.maxMovementVector = maxMovementVector;
  return this;
}

function AnimationController() {
  this.currentStateOrder = 0;
  this.movementVector = new V3(0, 0, 0);
  this.disabled = false;
  return this;
}

AnimationController.states = [
  new AnimationState(1, new V3(0.0, 0.0, +step), new V3(0.0, 0.0, 1.0)), // goes to front direction
  new AnimationState(2, new V3(0.0, 0.0, -step), new V3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(3, new V3(0.0, 0.0, -step), new V3(0.0, 0.0, -1.0)), // goes to behind
  new AnimationState(4, new V3(0.0, 0.0, +step), new V3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(5, new V3(+step, 0.0, 0.0), new V3(1.0, 0.0, 0.0)), // goes to right
  new AnimationState(6, new V3(-step, 0.0, 0.0), new V3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(7, new V3(-step, 0.0, 0.0), new V3(-1.0, 0.0, 0.0)), // goes to left
  new AnimationState(8, new V3(+step, 0.0, 0.0), new V3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(9, new V3(0.0, +step, 0.0), new V3(0.0, 1.0, 0.0)), // goes to up
  new AnimationState(10, new V3(0.0, -step, 0.0), new V3(0.0, 0.0, 0.0)), // goes to origin
  new AnimationState(11, new V3(0.0, -step, 0.0), new V3(0.0, -1.0, 0.0)), // goes to down
  new AnimationState(12, new V3(0.0, +step, 0.0), new V3(0.0, 0.0, 0.0)) // back to origin
];

AnimationController.prototype.forward = function() {
  var currentState = AnimationController.states[this.currentStateOrder];
  this.movementVector.add(currentState.stepVector);
  if (this.movementVector.equals(currentState.maxMovementVector)) {
    this.currentStateOrder = (this.currentStateOrder + 1) % AnimationController.states.length; // cyclic
  }
};

AnimationController.prototype.toggleDisabled = function() {
    this.disabled = !this.disabled;
    return this.disabled;
}
