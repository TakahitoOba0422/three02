window.addEventListener("load", init);

function init() {
  // サイズを指定
  const width = 960;
  const height = 540;
  let rot = 0;

  // シーン作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.z = 1000;

  // レンダラー作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 球体生成
  const geometry = new THREE.SphereGeometry(300, 30, 30);

  // マテリアル作成、材質決定
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("earthmap1k.jpg"),
  });

  // メッシュ作成
  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // ポイント光源
  const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // 星屑追加
  createStarField();

  // 星屑生成の関数
  function createStarField(){
    // x,y,z座標の値がランダムに入った入れるを500個生成
    const vertices = [];
    for(let i = 0; i< 500; i++) {
      const x = 3000 * (Math.random() - 0.5);
      const y = 3000 * (Math.random() - 0.5);
      const z = 3000 * (Math.random() - 0.5);

      vertices.push(x, y, z);
    }

    // 星屑の形状データ作成
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position", 
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    
    // 材質、マテリアルの作成
    const material = new THREE.PointsMaterial({
      size: 8,
      color: 0xffffff,
    });

    // メッシュ
    const stars = new THREE.Points(geometry,material);
    scene.add(stars);
  }

  // フレームごとに呼び出す関数
  function tick() {
    rot += 0.5;
    // ラジアン変換
    const radian = (rot * Math.PI) / 180;

    // 角度に応じてカメラの位置を変換
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 2000 * Math.cos(radian);

    // カメラの見る位置を固定
    camera.lookAt(new THREE.Vector3(0, 0, -400));

    // ライトを周回させる
    pointLight.position.set(
      500 * Math.sin(Date.now() / 500),
      500 * Math.sin(Date.now() / 500),
      500 * Math.sin(Date.now() / 500)
    );

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();
}
