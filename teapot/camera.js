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
  this.at = vec3(0, 0, 0);
  this.up = vec3(0, 1, 0);
  this.eye = vec3(0, 0, -5);
  return this;
}

const perspectiveSettings = {
  near: 1.0,
  far: 200.0,
  fovy: 90.0, // Field-of-view in Y direction angle (in degrees)
  aspect: 1.0 // Viewport aspect ratio
};
