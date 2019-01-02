
app.controller('customerCtrl', function($scope, customer) {

    customer.getActive().then(customer => {
        $scope.customer = customer;
    });

})