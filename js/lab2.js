var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000022);
document.body.appendChild(renderer.domElement);

var axes = new THREE.AxesHelper(8);
scene.add(axes);

var table = new THREE.Geometry();
var tableDim = [6.7, 0.1, 2.7];
var wardrobeDim = [2.7, 6, 4];
var r1 = 0.3;
var r2 = 0.9;

table.vertices.push(new THREE.Vector3(0, 0, 0));
table.vertices.push(new THREE.Vector3(tableDim[0], 0, 0));

// Vertices that belong to the first rounded corner and lower layer
for (let theta = 0 ; theta <= Math.PI/2 ; theta += Math.PI/18)
  table.vertices.push(new THREE.Vector3(tableDim[0] - r1 + r1*Math.cos(theta), 0, tableDim[2] + r1*Math.sin(theta)));

// Vertices that belong to the second rounded corner and lower layer
for (let theta = 0 ; theta <= Math.PI/2 ; theta += Math.PI/18)
  table.vertices.push(new THREE.Vector3(wardrobeDim[0] + r2*(1-Math.sin(theta)), 0, tableDim[2] + r1 + r2*(1-Math.cos(theta))));

table.vertices.push(new THREE.Vector3(0, 0, tableDim[2] + r1 + r2));
table.vertices.push(new THREE.Vector3(0, tableDim[1], 0));
table.vertices.push(new THREE.Vector3(tableDim[0], tableDim[1], 0));

// Vertices that belong to the first rounded corner and upper layer
for (let theta = 0 ; theta <= Math.PI/2 ; theta += Math.PI/18)
  table.vertices.push(new THREE.Vector3(tableDim[0] - r1 + r1*Math.cos(theta), tableDim[1], tableDim[2] + r1*Math.sin(theta)));

// Vertices that belong to the second rounded corner and upper layer
for (let theta = 0 ; theta <= Math.PI/2 ; theta += Math.PI/18)
  table.vertices.push(new THREE.Vector3(wardrobeDim[0] + r2*(1-Math.sin(theta)), tableDim[1], tableDim[2] + r1 + r2*(1-Math.cos(theta))));

table.vertices.push(new THREE.Vector3(0, tableDim[1], tableDim[2] + r1 + r2));

// Defining faces
var face = [];
for (let i = 0; i < (table.vertices.length-1)/2 - 2; i++) {
  face[i] = new THREE.Face3(0, i+1, i+2);
  table.faces.push(face[i]);
}
for (let i = Math.floor((table.vertices.length+1)/2); i < table.vertices.length - 2; i++) {
  face[i] = new THREE.Face3(Math.floor((table.vertices.length+1)/2), i+2, i+1);
  table.faces.push(face[i]);
}

// Connecting table lateral
let i = 0;

while (i < (table.vertices.length-1)/2) {
  face[i] = new THREE.Face3(i, i + Math.floor((table.vertices.length+1)/2), i + 1);
  table.faces.push(face[i]);
  i++;
  if (i < (table.vertices.length-1)/2) {
    face[i] = new THREE.Face3(i, Math.floor((table.vertices.length+1)/2) + i-1, Math.floor((table.vertices.length+1)/2)+i);
    table.faces.push(face[i]);
  }
}

table.faces.push(new THREE.Face3(0, 22, 23));

table.faceVertexUvs = new Array();
table.faceVertexUvs.push(new Array());

for (let i = 0; i < table.faces.length; i++) {
  let v1 = table.vertices[table.faces[i].a],
  v2 = table.vertices[table.faces[i].b],
  v3 = table.vertices[table.faces[i].c];

  table.faceVertexUvs[0].push([
    new THREE.Vector2(v1.x/tableDim[0], v1.y/tableDim[1]),
    new THREE.Vector2(v2.x/tableDim[0], v2.y/tableDim[1]),
    new THREE.Vector2(v3.x/tableDim[0], v3.y/tableDim[1])
  ]);
}

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load("img/wood.jpg");

table.computeFaceNormals();
table.computeVertexNormals();

table.colorsNeedUpdate = true;
table.verticesNeedUpdate = true;
table.uvsNeedUpdate = true;
table.dynamic = true;

var table_mesh = new THREE.Mesh(table,
  new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    // side: THREE.DoubleSide,
    map: texture,
  })
);
scene.add(table_mesh);

// Changing table position
table_mesh.rotation.x = Math.PI/2;
table_mesh.rotation.y = Math.PI/2;

var light =  new THREE.PointLight(0xffffff, 1.0);
//light.position={ x: 2, y:1, z: 3};
light.position.set(4,4,2);

scene.add(light);
camera.position.x = 8;
camera.position.z = 8;
camera.position.y = 8;
camera.up = new THREE.Vector3(0,0,1);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var controls = new THREE.OrbitControls(camera);

var t = 0;
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  //camera.lookAt(new THREE.Vector3(0, 0, 0))
  renderer.render(scene, camera);
  t = t + 0.01;

  // Changing table shape
  for (let i = 0; i < (table.vertices.length-1)/2; i++) {
    table.vertices[i].set(table.vertices[i].x, (table.vertices[i].y-0.05)*Math.sin(4*t), table.vertices[i].z);
  }

  table.dynamic = true;
  table.verticesNeedUpdate = true;
}

animate();
