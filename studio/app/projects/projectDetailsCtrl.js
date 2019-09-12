app.controller("projectDetailsCtrl", function ($scope, customerSrv, projectSrv, $routeParams) {

    $scope.selected = {};
    $scope.showSuccessAlert = false;
    $scope.showErrorAlert = false;
    $scope.showSavingAlert = false;

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        projectSrv.getById($routeParams.id).then(project => {
            $scope.project = project;
        });
    });

    $scope.closeAlert = function(type) {
        if (type === "success") {
            $scope.showSuccessAlert = false;
        } else if (type == "error") {
            $scope.showErrorAlert = false;
        } else if (type == "saving") {
            $scope.showSavingAlert = false;
        }
    }

    $scope.updateProject = function() {
        let params = {};
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.showSavingAlert = true;

        if ($scope.selected.thumbnail) {
            let file = document.getElementById("thumbnail").files[0];
            params.newThumbnail = {};
            params.newThumbnail.name = file.name;
            params.newThumbnail.contentType = file.type;
            params.newThumbnail.data = $scope.selected.thumbnail.src;
        }

        projectSrv.update($scope.project, params).then(project => {
            console.log("settings saved successfully");

            $scope.showSavingAlert = false;
            $scope.showSuccessAlert = true;

            $scope.project = project;
        }, function (err) {
            console.error(err);
            console.log("error in saving settings");
            $scope.showSavingAlert = false;
            $scope.showErrorAlert = true;

        });
    }


});