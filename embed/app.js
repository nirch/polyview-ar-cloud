
var app = angular.module("embedApp", ["ngRoute", "ng.deviceDetector", "FBAngular"]);


app.config(function($routeProvider) {
    $routeProvider
    .when('/:modelId', {
      templateUrl: 'embed.html',
      controller: 'embedCtrl'
    });
});

app.controller("embedCtrl", function($scope, $sce, $routeParams, modelSrv, deviceDetector, projectSrv, customerSrv) {

    modelSrv.getById($routeParams.modelId).then(model => {
        $scope.model = model;
        $scope.model.claraEmbedId = $sce.trustAsResourceUrl("https://clara.io/player/v2/" + $scope.model.claraId + "?tools=hide");

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
                    'page_title' : customer.displayName + " | " + project.displayName + " | " + model.displayName,
                    'page_path': "/" + customer.techName + "/" + project.techName + "/" + model.techName,
                    'custom_map': {'dimension1': 'viewer_type'}
                });
                gtag('event', 'viewer_dimension', {'viewer_type': viewrType});
            });
        });
    });

    // Initially, do not go into full screen
    $scope.isFullscreen = false;

    $scope.toggleFullScreen = function() {
        $scope.isFullscreen = !$scope.isFullscreen;
    }

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

    $scope.showAppleArQuickLook = function() {
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