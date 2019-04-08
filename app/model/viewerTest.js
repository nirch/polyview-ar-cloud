
app.controller("viewerTestCtrl", function ($scope, $routeParams, customerSrv, projectSrv, modelSrv, $sce, $document) {



    customerSrv.getActive().then(customer => {
        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            modelSrv.getByName(project, $routeParams.modelName).then(model => {
                $scope.model = model;

                var loader = new THREE.GLTFLoader();

                // Creating a perspective camera. 
                // The arguments are sensible defaults. 
                // If your model is very large you may have to adjust the last two arguments, 
                // which are the frustum near plane and frustum far plane. 
                // They basically state that nothing nearer than one unit and nothing farther than a thousand units will be rendered.
                var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);

                // A scene holds your camera(s), lights and models, as it would do in real life. 
                // The code below adds a white ambient light which illuminates the whole scene without any shading.
                var scene = new THREE.Scene();

                var renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.physicallyCorrectLights = true;
                renderer.gammaOutput = true;
                renderer.gammaFactor = 2.2;
                renderer.setClearColor(0xffffff);
                //renderer.setClearColor(new THREE.Color("hsl(0, 0%, 90%)"));
                renderer.setPixelRatio(window.devicePixelRatio);
                //this.renderer.setSize(el.clientWidth, el.clientHeight);
                renderer.setSize(window.innerWidth, window.innerHeight);


                document.body.appendChild(renderer.domElement);

                /* Controls */
                var controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.autoRotate = false;
                controls.autoRotateSpeed = -10;
                controls.screenSpacePanning = true;

                // controls.enableDamping = true;
                // controls.dampingFactor = 0.25;
                // controls.enableZoom = true;
                // var geometry = new THREE.BoxGeometry(1, 1, 1);
                // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                // var cube = new THREE.Mesh(geometry, material);
                // scene.add(cube);

                loader.load(model.gltfUrl, function (gltf) {

                    gltf.scene.updateMatrixWorld();
                    const box = new THREE.Box3().setFromObject(gltf.scene);
                    const size = box.getSize(new THREE.Vector3()).length();
                    const center = box.getCenter(new THREE.Vector3());

                    controls.reset();

                    gltf.scene.position.x += (gltf.scene.position.x - center.x);
                    gltf.scene.position.y += (gltf.scene.position.y - center.y);
                    gltf.scene.position.z += (gltf.scene.position.z - center.z);
                    controls.maxDistance = size * 10;
                    camera.near = size / 100;
                    camera.far = size * 100;
                    camera.updateProjectionMatrix();

                    camera.position.copy(center);
                    camera.position.x += size / 2.0;
                    camera.position.y += size / 5.0;
                    camera.position.z += size / 2.0;
                    camera.lookAt(center);

                    controls.enabled = true;
                    controls.saveState();

                    scene.add(gltf.scene);


                    var ambient = new THREE.AmbientLight(0xffffff, 0.3);
                    scene.add(ambient);

                    const directional = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
                    directional.position.set(0.5, 0, 0.866); // ~60º
                    scene.add(directional);

                    renderer.toneMappingExposure = 1.0;


                    // Environment
                    const path = "assets/skybox/"
                    const format = ".jpg"
                    const cubeMapURLs = [
                        path + 'posx' + format, path + 'negx' + format,
                        path + 'posy' + format, path + 'negy' + format,
                        path + 'posz' + format, path + 'negz' + format
                    ];
                    const envMap = new THREE.CubeTextureLoader().load(cubeMapURLs);
                    envMap.format = THREE.RGBFormat;
                    traverseMaterials(gltf.scene, (material) => {
                        if (material.isMeshStandardMaterial || material.isGLTFSpecularGlossinessMaterial) {
                            material.envMap = envMap;
                            material.needsUpdate = true;
                        }
                    });



                    // traverseMaterials(gltf.scene, (material) => {
                    //     if (material.map) material.map.encoding = THREE.sRGBEncoding;
                    //     if (material.emissiveMap) material.emissiveMap.encoding = THREE.sRGBEncoding;
                    //     if (material.map || material.emissiveMap) material.needsUpdate = true;
                    // });

                }, undefined, function (error) {
                    console.error(error);
                });


                var animate = function () {
                    requestAnimationFrame(animate);

                    controls.update();
                    // cube.rotation.x += 0.01;
                    // cube.rotation.y += 0.01;

                    renderer.render(scene, camera);
                };

                animate();

                function traverseMaterials(object, callback) {
                    object.traverse((node) => {
                        if (!node.isMesh) return;
                        const materials = Array.isArray(node.material)
                            ? node.material
                            : [node.material];
                        materials.forEach(callback);
                    });
                }


            }, error => {
                if (error === 404) {
                    $scope.notFound = true;
                }
            });
        }, error => {
            if (error === 404) {
                $scope.notFound = true;
            }
        });
    });
});