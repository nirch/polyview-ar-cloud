
app.controller("navbarCtrl", function($scope, customerSrv) {

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;
    });

})