
var app = angular.module("arCloudLogin", []);

app.controller("loginCtrl", function ($scope, userSrv, $location, $window) {
    $scope.invalidLogin = false;

    $scope.login = function () {
        userSrv.login($scope.email, $scope.pwd).then((user) => {
            // after successful login navigating into the studio
            $window.location.hash = "";
            $window.location.pathname = "/studio";
        }, error => {
            $scope.invalidLogin = true;
            $scope.$apply();
            console.error('Error while logging in user', error);
        })
    }

})