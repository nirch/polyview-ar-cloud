app.controller("modelDetailsCtrl", function ($scope, customerSrv, projectSrv, modelSrv, $routeParams) {

    $scope.selected = {};
    $scope.selected.project = null;
    $scope.projects = [];
    $scope.showSuccessAlert = false;
    $scope.showErrorAlert = false;

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        modelSrv.getById($routeParams.id).then(model => {
            $scope.model = model;

            projectSrv.getByCustomer(customer).then(projects => {
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
        }
    }

    $scope.updateModel = function() {
        let params = {};

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

        modelSrv.updateModel($scope.model, params).then(model => {
            console.log("settings saved successfully");

            $scope.showSuccessAlert = true;

            $scope.model = model;
            $scope.projects.forEach(project => {
                if (project.id === model.projectId) {
                    $scope.selected.project = project;
                }
            });

        }, function (err) {
            console.error(err);
            console.log("error in saving settings");
            $scope.showErrorAlert = true;
        });
    }
});