// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');
require('three/examples/js/loaders/GLTFLoader');

const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
  context: 'webgl',
  attributes: { antialias: true },
  dimensions: [1920, 1080],
  duration: 5,
  fps: 30,
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  const mono = true;

  const clearColor = mono ? '#000' : '#3f2936';
  renderer.setClearColor(clearColor, 1);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, 5);
  camera.lookAt(new THREE.Vector3());

  // const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  // Lights
  const aLight = new THREE.AmbientLight(mono ? 0x000000 : 0x3f2936, 0.8);
  scene.add(aLight);

  const keyLight = new THREE.DirectionalLight(mono ? 0xffffff : 0xff0059, mono ? 0.3 : 0.9);
  keyLight.position.set(-1, 1.5, 0.8).multiplyScalar(2);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(mono ? 0xffffff : 0xff3892, mono ? 0.2 : 0.6);
  fillLight.position.set(1, 0.5, 0).multiplyScalar(2);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(mono ? 0xffffff : 0xff3892, mono ? 0.1 : 0.3);
  backLight.position.set(1, 0.5, -0.4).multiplyScalar(2);
  scene.add(backLight);

  // var keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 1);
  // scene.add(keyLightHelper);
  // var fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 1);
  // scene.add(fillLightHelper);
  // var backLightHelper = new THREE.DirectionalLightHelper(backLight, 1);
  // scene.add(backLightHelper);

  // Model

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5; // default
  keyLight.shadow.camera.far = 500; // default

  const gltfLoader = new THREE.GLTFLoader().setPath('assets/');

  let head;

  gltfLoader.load('head.glb', function (gltf) {
    head = gltf.scene;
    head.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    head.children[0].rotation.y = Math.PI / 2;
    scene.add(head);
  });

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead, time }) {
      // controls.update();
      if (head) head.rotation.y = 2 * Math.PI * playhead;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
