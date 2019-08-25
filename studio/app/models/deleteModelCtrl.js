app.controller("deleteModelCtrl", function($scope, $uibModalInstance, modelSrv, modelToDelete) {
    
    $scope.delete = function () {
        modelSrv.deleteModel(modelToDelete).then(() => {
            $uibModalInstance.close();
        })
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

});