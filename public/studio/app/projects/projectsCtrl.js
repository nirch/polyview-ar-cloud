
app.controller("projectsCtrl", function($scope, customerSrv, projectSrv, $uibModal, $location) {

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        // loading projects (categories)
        projectSrv.getByCustomer(customer, false).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.filterProjects = function (project) {

        if ($scope.projectSearch && !project.displayName.toLowerCase().includes($scope.projectSearch.toLowerCase())) {
            return false;
        }

        return true;
    }

    $scope.newProject = function () {
        // Opening new project modal
        let modalInstance = $uibModal.open({
            templateUrl: 'app/projects/newProject.html',
            controller: 'newProjectCtrl',
            size: 'lg'
        });

        // Waiting for a result from the modal
        modalInstance.result.then(newProject => {
            // navigating to the new project's page
            $location.path("/categories/" + newProject.id);
        }, function () {
            console.log("new project canceled");
        });
    }



});