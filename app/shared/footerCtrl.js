
app.controller("footerCtrl", function($scope, customerSrv) {

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;
    });

})