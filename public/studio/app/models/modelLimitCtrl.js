app.controller("modelLimitCtrl", function ($scope, $uibModalInstance, customerSrv) {

    // Sending a mail to polyview team that this customer reached the limit
    customerSrv.getActive().then(customer => {

        // Sending mail if mail was never sent to this customer
        if (!localStorage.limitMailSent) {
            var template_params = {
                customer_name: customer.displayName,
                email: Parse.User.current().get("email"),
                customer_id: customer.id
            }

            var service_id = "default_service";
            var template_id = "template_yJ07gOeG";
            emailjs.send(service_id, template_id, template_params);

            localStorage.limitMailSent = true;
        }
    });

    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    }

});