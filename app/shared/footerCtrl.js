
app.controller("footerCtrl", function($scope, customer) {

    customer.getActive().then(customer => {
        $scope.customer = customer;
    });

})