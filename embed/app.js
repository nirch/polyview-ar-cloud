
var app = angular.module("embedApp", ["ngRoute", "ng.deviceDetector"]);


app.config(function($routeProvider) {
    $routeProvider
    .when('/:modelId', {
      templateUrl: 'embed.html',
      controller: 'embedCtrl'
    });
});

app.controller("embedCtrl", function($scope, $sce, $routeParams, modelSrv, deviceDetector) {

    modelSrv.getById($routeParams.modelId).then(model => {
        $scope.model = model;
        $scope.model.claraEmbedId = $sce.trustAsResourceUrl("https://clara.io/player/v2/" + $scope.model.claraId + "?tools=hide");

        // Checking if there is a need to show Apple's AR Quick Look
        checkAppleArQuickLook();
    });

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