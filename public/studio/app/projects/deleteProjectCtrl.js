app.controller("deleteProjectCtrl", function($scope, $uibModalInstance, projectSrv, projectToDelete) {
    
    $scope.delete = function () {
        projectSrv.deleteProject(projectToDelete).then(() => {
            $uibModalInstance.close();
        })
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

});