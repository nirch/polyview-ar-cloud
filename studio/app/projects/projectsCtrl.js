
app.controller("projectsCtrl", function($scope, customerSrv, projectSrv) {

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



});