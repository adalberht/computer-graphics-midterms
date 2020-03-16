function PerspectiveSettings(canvas) {
  return {
    near: 1.0,
    far: 200.0,
    fovy: 90.0, // Field-of-view in Y direction angle (in degrees)
    get aspect() {
      return canvas.width / canvas.height;
    }
  };
}

function CameraController() {
  var coordinates = [
    // Red Coordinates
    [
      [vec3(-1, 1, -1), vec3(0, 1, -1), vec3(1, 1, -1)],
      [vec3(-1, 0, -1), vec3(0, 0, -1), vec3(1, 0, -1)],
      [vec3(-1, -1, -1), vec3(0, -1, -1), vec3(1, -1, -1)]
    ],

    // Green Coordinates
    [
      [vec3(-1, 1, 0), vec3(0, 1, 0), vec3(1, 1, 0)],
      [vec3(-1, 0, 0), null, vec3(1, 0, 0)],
      [vec3(-1, -1, 0), vec3(0, -1, 0), vec3(1, -1, 0)]
    ],

    // Blue Coordinates
    [
      [vec3(-1, 1, 1), vec3(0, 1, 1), vec3(1, 1, 1)],
      [vec3(-1, 0, 1), vec3(0, 0, 1), vec3(1, 0, 1)],
      [vec3(-1, -1, 1), vec3(0, -1, 1), vec3(1, -1, 1)]
    ]
  ];
  this.x = 1;
  this.y = 1;
  this.z = 1;

  this.currentPlaneCoordinates = coordinates[0];
  this.radius = 5;
  return this;
}

CameraController.prototype = {
  get eye() {
    var cameraPosition = this.currentPlaneCoordinates[this.y][this.x];
    var [x, y, z] = cameraPosition;
    var phi = Math.atan2(y, x);
    var theta = Math.atan2(Math.sqrt(x * x + y * y), x);

    x = this.radius * Math.sin(theta) * Math.cos(phi);
    y = this.radius * Math.sin(theta) * Math.sin(phi);
    z = this.z * this.radius;
    return vec3(x, y, z);
  },
  get at() {
    return vec3();
  },
  get up() {
    return vec3(0, 1, 0);
  },
  incrementZ: function() {
    this.z += 1;
    if (this.z > 1) this.z = 1;
  },
  decrementZ: function() {
    this.z -= 1;
    if (this.z < -1) this.z = -1;
  }
};
