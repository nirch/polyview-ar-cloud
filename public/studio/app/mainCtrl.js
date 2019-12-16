app.controller("mainCtrl", function($scope, customerSrv, $location, userSrv, $window) {

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer
        if($location.path() === "") {
            $location.path("/models");
        }
    });

    $scope.location = $location;

    $scope.logout = function() {
        userSrv.logout().then(() => {
            $window.location.hash = "";
            $window.location.pathname = "/login";
        });
    }

});