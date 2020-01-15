app.controller("modelDetailsCtrl", function ($scope, customerSrv, projectSrv, modelSrv, $routeParams, $uibModal, $location, $interval) {

    const DEFAULT_GLTF_UPLOAD_TEXT = "Choose glTF or GLB file";
    const DEFAULT_USDZ_UPLOAD_TEXT = "Choose USDZ file";
    $scope.selected = {};
    $scope.selected.project = null;
    $scope.projects = [];
    $scope.showSuccessAlert = false;
    $scope.showErrorAlert = false;
    $scope.showConvertingAlert = false;

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        modelSrv.getById($routeParams.id).then(model => {
            $scope.model = model;

            projectSrv.getByCustomer(customer, false).then(projects => {
                $scope.projects = projects;
                projects.forEach(project => {
                    if (project.id === model.projectId) {
                        $scope.selected.project = project;
                    }
                });
            });
        });
    });

    $scope.closeAlert = function(type) {
        if (type === "success") {
            $scope.showSuccessAlert = false;
        } else if (type == "error") {
            $scope.showErrorAlert = false;
        } else if (type == "saving") {
            $scope.showSavingAlert = false;
        } else if (type == "usdz") {
            $scope.showConvertingAlert = false;
        }
    }

    $scope.updateModel = function() {
        let params = {};
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showSavingAlert = true;

        if ($scope.selected.project.id != $scope.model.projectId) {
            params.updateProject = $scope.selected.project;
        }

        if ($scope.selected.thumbnail) {
            let file = document.getElementById("thumbnail").files[0];
            params.newThumbnail = {};
            params.newThumbnail.name = file.name;
            params.newThumbnail.contentType = file.type;
            params.newThumbnail.data = $scope.selected.thumbnail.src;
        }

        if ($scope.selected.gltf) {
            params.newGltf = {};
            params.newGltf.name = $scope.selected.gltf.name;
            params.newGltf.contentType = $scope.selected.gltf.type;
            params.newGltf.data = $scope.selected.gltf;
        }

        if ($scope.selected.usdz) {
            params.newUSDZ = {};
            params.newUSDZ.name = $scope.selected.usdz.name;
            params.newUSDZ.contentType = $scope.selected.usdz.type;
            params.newUSDZ.data = $scope.selected.usdz;
        }


        modelSrv.updateModel($scope.model, params).then(model => {
            console.log("settings saved successfully");

            $scope.showSavingAlert = false;

            // Checking if USDZ conversion is needed
            if ($scope.selected.gltf) {
                $scope.showConvertingAlert = true;

                let usdzConversionInterval = $interval(() => {
                    modelSrv.getById($scope.model.id).then(checkModel => {
                        // checking that there is a new USDZ file (not similar to the previous one)
                        if (checkModel.usdzUrl && checkModel.usdzUrl !== $scope.model.usdzUrl) {
                            // stop intetval
                            $interval.cancel(usdzConversionInterval);
                            $scope.showConvertingAlert = false;

                            modelSuccessfullySaved(checkModel);
                        }
                    })
                }, 1000);
            } else {
                modelSuccessfullySaved(model);
            }



        }, function (err) {
            console.error(err);
            console.log("error in saving settings");
            $scope.showSavingAlert = false;
            $scope.showErrorAlert = true;

        });
    }

    function modelSuccessfullySaved(savedModel) {
        $scope.showSuccessAlert = true;

        $scope.model = savedModel;
        $scope.projects.forEach(project => {
            if (project.id === savedModel.projectId) {
                $scope.selected.project = project;
            }
        });
        $scope.selected.gltf = null;
        $scope.selected.usdz = null;
        $scope.selected.thumbnail = null;

    }

    $scope.changeGltf = function() {
        $scope.selected.gltf = document.getElementById("gltf").files[0];
        $scope.$apply();
    }

    $scope.gltfText = function() {
        return $scope.selected.gltf ? $scope.selected.gltf.name : DEFAULT_GLTF_UPLOAD_TEXT;
    }

    $scope.changeUSDZ = function() {
        $scope.selected.usdz = document.getElementById("usdz").files[0];
        $scope.$apply();
    }

    $scope.usdzText = function() {
        // return $scope.selected.usdz ? $scope.selected.usdz.name : DEFAULT_USDZ_UPLOAD_TEXT;
        return "USDZ files are automatically generated from the uploaded glTF/GLB"
    }

    $scope.deleteModel = function() {
        // Opening delete alert modal
        let modalInstance = $uibModal.open({
            templateUrl: 'app/models/deleteModel.html',
            controller: 'deleteModelCtrl',
            resolve: {
                modelToDelete: function() {
                    return $scope.model;
                }
            }
        });

        // Waiting for a result from the modal
        modalInstance.result.then(function () {
            // navigating to models page
            $location.path("/models");
        }, function () {
            console.log("delete model canceled");
        });

    }
});