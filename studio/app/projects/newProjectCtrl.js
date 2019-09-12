app.controller("newProjectCtrl", function ($scope, $uibModalInstance, customerSrv, projectSrv) {

    $scope.project = {};

    $scope.create = function () {
        projectSrv.create($scope.project.displayName, $scope.project.techName).then(project => {
            $uibModalInstance.close(project);
        })
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

});