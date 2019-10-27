
var app = angular.module("embedApp", ["ngRoute", "ng.deviceDetector", "FBAngular"]);


app.config(function ($routeProvider) {
    $routeProvider
        .when('/:modelId', {
            templateUrl: 'embed.html',
            controller: 'embedCtrl'
        });
});

app.controller("embedCtrl", function ($rootScope, $scope, $sce, $routeParams, modelSrv,
    deviceDetector, projectSrv, customerSrv, Fullscreen, $location, environmentSrv) {

    // whether to show google viewer (default) or our viewer
    $scope.isGoogleViewer = $location.search().polyviewer ? false : true;

    // this is to hide the fullscreen button from iOS devices until I will add the support
    $scope.isIOS = deviceDetector.os === "ios";

    modelSrv.getById($routeParams.modelId).then(model => {
        $scope.model = model;
        $scope.model.claraEmbedId = $sce.trustAsResourceUrl(
            "https://clara.io/player/v2/" + $scope.model.claraId + "?tools=hide");
        $scope.model.gltfSecured = $sce.trustAsResourceUrl($scope.model.gltfUrl);
    
        getViewerSetting($scope.model).then(settings => {
            $scope.viewerSettings = settings;
            updateEnvImage();
        });

        // Checking which viewer to show (Apple's AR Quick Look, Polyviewer or Clara viewer)
        checkViewer();

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


        if (model.gltfUrl && !$scope.isGoogleViewer) {
            $scope.isPolyviewerLoading = true;
            initPolyviewer(model);
        }

    });

    // ****** POLYVIEWER ******
    // Needs to be moved to a directive...

    function initPolyviewer(model) {
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

        // Initializing the renderer
        var renderer = initRenderer();

        // Creating and appending the canvas (renderer) to the DOM
        var viewerElement = document.getElementById("viewer");
        viewerElement.appendChild(renderer.domElement);

        // Initializing the orbit controls
        var controls = initControls(camera, renderer);

        // Loading the model
        loader.load(model.gltfUrl, function (gltf) {
            
            // Setting the camera position and controls based on model dimensions
            setCameraAndControlsBasedOnModel(gltf, controls, camera);

            scene.add(gltf.scene);

            setLighting(scene);

            // MOVED TO initRenderer: renderer.toneMappingExposure = 1.0;

            setEnvironment(traverseMaterials, gltf);

            window.addEventListener('resize', resize, false);

            // Removing the loader
            $scope.isPolyviewerLoading = false;
            $scope.$apply();
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
            const {clientHeight, clientWidth} = document.body;//viewerElement.parentElement.parentElement.parentElement;

            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);            
        }
    }
    
    function initRenderer() {
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.physicallyCorrectLights = true;
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;
        // renderer.setClearColor(0xffffff);
        //renderer.setClearColor(new THREE.Color("hsl(0, 0%, 90%)"));
        renderer.setPixelRatio(window.devicePixelRatio);
        //this.renderer.setSize(el.clientWidth, el.clientHeight);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMappingExposure = 1.0;

        return renderer;
    }

    function initControls(camera, renderer) {
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.autoRotate = false;
        controls.autoRotateSpeed = -10;
        controls.screenSpacePanning = true;
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.25;
        // controls.enableZoom = true;
        return controls;
    }

    function setCameraAndControlsBasedOnModel(gltf, controls, camera) {
        
        // Getting model dimensions
        gltf.scene.updateMatrixWorld();
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        controls.reset();

        gltf.scene.position.x += (gltf.scene.position.x - center.x);
        gltf.scene.position.y += (gltf.scene.position.y - center.y);
        gltf.scene.position.z += (gltf.scene.position.z - center.z);

        controls.maxDistance = size * 10;

        // Updating the camera
        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();
        camera.position.copy(center);
        camera.position.x += size / 2.0;
        camera.position.y += size / 5.0;
        camera.position.z += size / 2.0;
        camera.lookAt(center);

        // Updating the controls
        controls.enabled = true;
        controls.saveState();
    }
    
    function setLighting(scene) {
        var ambient = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambient);

        // const directional = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
        // directional.position.set(0.5, 0, 0.866); // ~60º
        // scene.add(directional);

        const hemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.85);
        scene.add(hemisphere);
    }
    
    function setEnvironment(traverseMaterials, gltf) {
        const path = "../assets/skybox/";
        const format = ".jpg";
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

    // ****** END POLYVIEWER ******


    // ****** FULLSCREEN ******

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

    // ****** CHECK VIEWER ******

    var isAppleArQuickLook = false;
    var isClaraViewer = false;
    var isPolyviewer = false;

    function checkViewer() {
        // First checking if there is an ios format file available (usdz)
        // Then, if the file is available, checking if we are running on a Safari 12 browser
        if (isSafariFormatAvailable() && isSafari12()) {
            isAppleArQuickLook = true;
        } else if (isPolyviewerFormatAvailable()) {
            isPolyviewer = true;
        } else {
            isClaraViewer = true;
        }
    }

    $scope.showAppleArQuickLook = function () {
        return isAppleArQuickLook;
    }

    $scope.showClaraViewer = function () {
        return isClaraViewer;
    }

    $scope.showPolyviewer = function () {
        return isPolyviewer;
    }

    async function getViewerSetting(model) {
        let viewerSettings;

        if (!model.editor) {
            // loading default settings
            viewerSettings = await getDefaultViewerSettings();
        } else {
            let env = {};
            if (model.editor.environmentId) {
                env = await environmentSrv.getById(model.editor.environmentId);
            }

             // Loading saved settings
             viewerSettings = {
                exposure: model.editor.exposure ? model.editor.exposure : 1,
                shadowIntensity: model.editor.shadowIntensity,
                envImage: env.imageUrl
            }
        }

        return viewerSettings;
    }

    async function getDefaultViewerSettings() {
        const defaultEnvId = "otCxXiSe6F";
        const env = await environmentSrv.getById(defaultEnvId);
        const defaultSettings = {
            exposure: 1,
            shadowIntensity: 0.2,
            envImage: env.imageUrl
        }

        return defaultSettings;
    }

    // function togglePmrem () {
    //     var modelViewerElement = angular.element(document.querySelector('#model-viewer'));
    //     if ($scope.viewerSettings.enablePmrem) {
    //         // adding attribute
    //         modelViewerElement.attr("experimental-pmrem", "");
    //     } else {
    //         // removing attribute
    //         modelViewerElement.removeAttr("experimental-pmrem");
    //     }
    // }

    function updateEnvImage () {
        var modelViewerElement = angular.element(document.querySelector('#model-viewer'));
        if ($scope.viewerSettings.envImage) {
            // adding attribute
            modelViewerElement.attr("environment-image", $scope.viewerSettings.envImage);
        } else {
            // removing attribute
            modelViewerElement.removeAttr("environment-image");
        }
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

    function isPolyviewerFormatAvailable() {
        return $scope.model.gltfUrl ? true : false
    }


});

