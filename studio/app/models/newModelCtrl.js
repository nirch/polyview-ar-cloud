app.controller("newModelCtrl", function ($scope, $uibModalInstance, customerSrv, projectSrv, modelSrv) {

    $scope.model = {};

    customerSrv.getActive().then(customer => {
        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.create = function () {
        modelSrv.createModel($scope.model.displayName, $scope.model.project, $scope.model.techName).then(model => {
            $uibModalInstance.close(model);
        })
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

});