app.controller("newModelCtrl", function ($scope, $uibModalInstance, customerSrv, projectSrv, modelSrv) {

    $scope.model = {};

    customerSrv.getActive().then(customer => {
        projectSrv.getByCustomer(customer, false).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.create = function () {
        modelSrv.createModel($scope.model.displayName, $scope.model.project, $scope.model.techName).then(model => {
            $uibModalInstance.close(model);
        }).catch(error => {
            alert(JSON.stringify(error));
        })
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

});