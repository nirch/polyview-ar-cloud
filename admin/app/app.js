
var app = angular.module("adminApp", []);

app.controller("adminCtrl", function ($scope, customerSrv, projectSrv, modelSrv, $sce, environmentSrv) {

    let defaultSettings;

    $scope.selectedProject = null;
    $scope.selectedModel = null;
    $scope.selectedModelSecureUrl = null;
    $scope.projects = [];
    $scope.models = [];

    // Loading environments
    environmentSrv.getAll().then(environments => {
        $scope.environments = environments;

        defaultSettings = getDefaultEditorSettings(environments);

        // Loading projects
        customerSrv.getActive().then(customer => {
            projectSrv.getByCustomer(customer).then(projects => {
                $scope.projects = projects;
                $scope.selectedProject = $scope.projects[0];
                $scope.onProjectSelected();
            });
        });
    });

    $scope.onProjectSelected = function () {
        modelSrv.getByProject($scope.selectedProject, false).then(models => {
            $scope.models = [];
            models.forEach(model => {
                if (model.gltfUrl) {
                    $scope.models.push(model);
                }
            });
            $scope.selectedModel = $scope.models[0];
            if ($scope.selectedModel) {
                $scope.onModelSelected();
            }
        });
    }

    $scope.onModelSelected = function () {
        $scope.selectedModelSecureUrl = $sce.trustAsResourceUrl($scope.selectedModel.gltfUrl);
        $scope.selectedModel.editor = getDefaultEditorSettings($scope.environments);
        $scope.togglePmrem();
    }

    $scope.togglePmrem = function () {
        var modelViewerElement = angular.element(document.querySelector('#viewer'));
        if ($scope.selectedModel.editor.enablePmrem) {
            // adding attribute
            modelViewerElement.attr("experimental-pmrem", "");
        } else {
            // removing attribute
            modelViewerElement.removeAttr("experimental-pmrem");
        }
    }

    // Getting the default env settings
    function getDefaultEditorSettings(envs) {
        let defaultSettings = {
            envIntensity: 2,
            shadowIntensity: 0.2,
            stageLightIntensity: 1,
            enablePmrem: true,
            bgColor: "#ffffff"
        }

        // looking for the default env in the array
        let defaultEnvId = "otCxXiSe6F";
        let found = false;
        for (let i = 0; i < envs.length && !found; i++) {
            if (envs[i].id === defaultEnvId) {
                defaultSettings.selectedEnvironment = envs[i];
                found = true;
            }
        }

        return defaultSettings;
    }

});