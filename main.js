const videoElement = document.getElementsByClassName("input_video")[0],
  scene = new THREE.Scene(),
  camera3j = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1e3
  ),
  renderer = new THREE.WebGLRenderer(),
  parameters = { count: 1e3, size: 0.02 };
let geometryg = null,
  materialg = null,
  points = null,
  radius = 2,
  angle = 1.57;
(camera3j.position.x = radius * Math.cos(angle)),
  (camera3j.position.z = radius * Math.sin(angle));


// golla maker
for (var a, obj = new THREE.Object3D(), i = 0; i < 21; i++) {
  var b = new THREE.SphereGeometry(0.01, 32, 16),
    c = new THREE.MeshNormalMaterial();
  ((a = new THREE.Mesh(b, c)).rotation.x = Math.PI), obj.add(a);
}

// baksho maker
for (i = 0; i < 21; i++)
  (b = new THREE.BoxGeometry(0.02, 0.02, 0.02)),
    (c = new THREE.MeshNormalMaterial()),
    ((a = new THREE.Mesh(b, c)).rotation.x = Math.PI),
    obj.add(a);


scene.add(obj),
  (b = new THREE.Geometry()),
  (c = new THREE.LineBasicMaterial({ color: 10783210 })),
  (line1 = new THREE.Line(b, c));
 
  
// ///////////////////////////////////////////////////////////////////////////////  
// // connecting the hand points to make lines
// var rank = [0, 1, 2, 3, 4, 3, 2, 5, 6, 7, 8, 7, 6, 5, 9, 10, 11, 12, 11, 10, 9, 13, 14, 15, 16, 15, 14, 13, 17, 18, 19, 20, 19, 18, 17, 0, 21, 22, 23, 24, 25, 24, 23, 26, 27, 28, 29, 28, 27, 26, 30, 31, 32, 33, 32, 31, 30, 34, 35, 36, 37, 36, 35, 34, 38, 39, 40, 41, 40, 39, 38, 21];

// for (i = 0; i < rank.length; i++)
//   b.vertices.push(obj.children[rank[i]].position);
// ///////////////////////////////////////////////////////////////////////////////


// control function
function onResults(d) {
  // Check if two sets of hand landmarks are detected
  if (2 == d.multiHandLandmarks.length) {
     // Iterate over each landmark for the first hand
     for (let e = 0; e < 21; e++) {
       // Update the position of the corresponding object for the first hand
       obj.children[e].position.x = -d.multiHandLandmarks[0][e].x;
       obj.children[e].position.y = -d.multiHandLandmarks[0][e].y;
       obj.children[e].position.z = 0.6 + d.multiHandLandmarks[0][e].z;
       // Update the position of the corresponding object for the second hand
       obj.children[e + 21].position.x = -d.multiHandLandmarks[1][e].x;
       obj.children[e + 21].position.y = -d.multiHandLandmarks[1][e].y;
       obj.children[e + 21].position.z = 0.6 + d.multiHandLandmarks[0][e].z; // Note: This should likely be d.multiHandLandmarks[1][e].z for the second hand
     }
     // Check if the hands are moving upwards or downwards based on specific landmarks
     // If so, adjust the camera's position around a circular path
     if (d.multiHandLandmarks[0][7].y > d.multiHandLandmarks[0][5].y &&
         d.multiHandLandmarks[0][0].y > d.multiHandLandmarks[0][7].y &&
         d.multiHandLandmarks[0][19].y > d.multiHandLandmarks[0][17].y &&
         d.multiHandLandmarks[0][0].y > d.multiHandLandmarks[0][19].y) {
       angle += 0.03;
       camera3j.position.x = radius * Math.cos(angle);
       camera3j.position.z = radius * Math.sin(angle);
     }
     if (d.multiHandLandmarks[1][7].y > d.multiHandLandmarks[1][5].y &&
         d.multiHandLandmarks[1][0].y > d.multiHandLandmarks[1][7].y &&
         d.multiHandLandmarks[1][19].y > d.multiHandLandmarks[1][17].y &&
         d.multiHandLandmarks[1][0].y > d.multiHandLandmarks[1][19].y) {
       angle -= 0.03;
       camera3j.position.x = radius * Math.cos(angle);
       camera3j.position.z = radius * Math.sin(angle);
     }
  }
  // If only one hand is detected
  if (1 == d.multiHandLandmarks.length) {
     // Update the position of the objects for the single detected hand
     for (let g = 0; g < 21; g++) {
       obj.children[g].position.x = -d.multiHandLandmarks[0][g].x;
       obj.children[g].position.y = -d.multiHandLandmarks[0][g].y;
       obj.children[g].position.z = 1;
     }
     // Check for a specific hand gesture based on the distances between landmarks
     // If the gesture is detected, add or remove certain objects from the scene after a delay
     for (let h of d.multiHandLandmarks) {
       let fing1 = h[4];
       let fing2 = h[12];
       let fing3 = h[8];
       let dist12 = Math.sqrt(Math.pow(fing1.x - fing2.x, 2) + Math.pow(fing1.y - fing2.y, 2) + Math.pow(fing1.z - fing2.z, 2));
       if (dist12 < 0.1) {
         setTimeout(function() {
           let dist13 = Math.sqrt(Math.pow(fing1.x - fing3.x, 2) + Math.pow(fing1.y - fing3.y, 2) + Math.pow(fing1.z - fing3.z, 2));
           if (dist13 < 0.1) {
             if (null == scene.getObjectByName("pts")) {
               scene.add(points);
             } else {
               scene.add(moon);
               scene.add(sun);
               scene.add(pointLight);
             }
           }
         }, 700);
       }
     }
  }
  // Update the line object in the scene
  line1 = new THREE.Line(b, c);
 }


scene.add(line1),
  renderer.setSize(window.innerWidth, window.innerHeight),
  document.body.appendChild(renderer.domElement);
const hands = new Hands({
  locateFile: (b) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${b}`,
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}),
  hands.onResults(onResults);
const camera = new Camera(videoElement, {
  async onFrame() {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});

// Increase the size of the hands
const scaleFactor = 2;
for (let i = 0; i < obj.children.length; i++) {
  obj.children[i].scale.multiplyScalar(scaleFactor);
}
function animate() {
  camera3j.lookAt(0, 0, 0),
    (b.verticesNeedUpdate = !0),
    requestAnimationFrame(animate),
    renderer.render(scene, camera3j);
}
camera.start(),
  (camera3j.position.x = 0),
  (camera3j.position.y = 0),
  (camera3j.position.z = 2),
  camera3j.lookAt(0, 0, 0),
  animate();
