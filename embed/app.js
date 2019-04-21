
var app = angular.module("embedApp", ["ngRoute", "ng.deviceDetector", "FBAngular"]);


app.config(function ($routeProvider) {
    $routeProvider
        .when('/:modelId', {
            templateUrl: 'embed.html',
            controller: 'embedCtrl'
        });
});

app.controller("embedCtrl", function ($rootScope, $scope, $sce, $routeParams, modelSrv,
    deviceDetector, projectSrv, customerSrv, Fullscreen) {

    modelSrv.getById($routeParams.modelId).then(model => {
        $scope.model = model;
        $scope.model.claraEmbedId = $sce.trustAsResourceUrl(
            "https://clara.io/player/v2/" + $scope.model.claraId + "?tools=hide");

        // Checking if there is a need to show Apple's AR Quick Look
        checkAppleArQuickLook();

        //alert(model.parseModel.get("projectId").get("techName"));
        //gtag('config', 'UA-115185862-3');

        // Fetching the porject and customer objects merley for the tracking
        projectSrv.getById($scope.model.projectId).then(project => {
            customerSrv.getById(project.customerId).then(customer => {
                console.log(project.displayName);
                console.log(customer.displayName);

                // Sending a page view with the viewer type dimension
                var viewrType = $scope.showAppleArQuickLook() ? "AR Quick Look" : "3D Viewer";
                gtag('config', 'UA-115185862-3', {
                    'page_title': customer.displayName + " | " + project.displayName + " | " + model.displayName,
                    'page_path': "/" + customer.techName + "/" + project.techName + "/" + model.techName,
                    'custom_map': { 'dimension1': 'viewer_type' }
                });
                gtag('event', 'viewer_dimension', { 'viewer_type': viewrType });
            });
        });


        if (model.gltfUrl) {
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

            var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.physicallyCorrectLights = true;
            renderer.gammaOutput = true;
            renderer.gammaFactor = 2.2;
            // renderer.setClearColor(0xffffff);
            //renderer.setClearColor(new THREE.Color("hsl(0, 0%, 90%)"));
            renderer.setPixelRatio(window.devicePixelRatio);
            //this.renderer.setSize(el.clientWidth, el.clientHeight);
            renderer.setSize(window.innerWidth, window.innerHeight);


            var viewerElement = document.getElementById("viewer");
            viewerElement.appendChild(renderer.domElement);

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


                var ambient = new THREE.AmbientLight(0xffffff, 1);
                scene.add(ambient);

                // const directional = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
                // directional.position.set(0.5, 0, 0.866); // ~60º
                // scene.add(directional);

                const hemisphere = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
                scene.add( hemisphere );

                renderer.toneMappingExposure = 1.0;


                // Environment
                const path = "../assets/skybox/"
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

                window.addEventListener('resize', resize, false);


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

            var resize = function () {
                const {clientHeight, clientWidth} = viewerElement.parentElement.parentElement;

                camera.aspect = clientWidth / clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(clientWidth, clientHeight);            
            }

            function traverseMaterials(object, callback) {
                object.traverse((node) => {
                    if (!node.isMesh) return;
                    const materials = Array.isArray(node.material)
                        ? node.material
                        : [node.material];
                    materials.forEach(callback);
                });
            }

        }

    });

    // Initially, not in full screen
    $scope.isInFullScreen = false;

    $scope.toggleFullScreen = function () {
        // $scope.isFullscreen = !$scope.isFullscreen;

        if (Fullscreen.isEnabled()) {
            Fullscreen.cancel();
        }
        else {
            Fullscreen.all();
        }
    }

    // Catching event when going fullscreen or canceling it
    $rootScope.$on('FBFullscreen.change', function(events, isFullScreen){
        $scope.isInFullScreen = isFullScreen;
        $scope.$apply();
    })

    var isAppleArQuickLook = false;

    function checkAppleArQuickLook() {
        // First checking if there is an ios format file available (usdz)
        // Then, if the file is available, checking if we are running on a Safari 12 browser
        if (isSafariFormatAvailable() && isSafari12()) {
            isAppleArQuickLook = true;
        } else {
            isAppleArQuickLook = false;
        }
    }

    $scope.showAppleArQuickLook = function () {
        return isAppleArQuickLook;
    }

    function isSafariFormatAvailable() {
        return $scope.model.usdzUrl ? true : false
    }

    function isSafari12() {
        if (deviceDetector.os === "ios" && deviceDetector.browser === "safari" && parseInt(deviceDetector.browser_version) >= 12) {
            return true;
        } else {
            return false;
        }
    }

});