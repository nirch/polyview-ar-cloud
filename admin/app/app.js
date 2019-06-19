
var app = angular.module("adminApp", []);

app.controller("adminCtrl", function ($scope, customerSrv, projectSrv, modelSrv, $sce, environmentSrv) {

    $scope.selectedProject = null;
    $scope.selectedModel = null;
    $scope.selectedModelSecureUrl = null;
    $scope.projects = [];
    $scope.models = [];

    // Loading environments
    environmentSrv.getAll().then(environments => {
        $scope.environments = environments;

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
        
        // Loading the default params if there are no custom one
        if (!$scope.selectedModel.editor) {
            $scope.selectedModel.editor = getDefaultEditorSettings($scope.environments);
        } else {
            // we have custome settings - loading the default env
            $scope.selectedModel.editor.selectedEnvironment = getEnvironmentById($scope.environments, $scope.selectedModel.editor.selectedEnvironment);
        }

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

    $scope.applyChanges = function() {
        let settingsToSave = {
            envIntensity: $scope.selectedModel.editor.envIntensity,
            shadowIntensity: $scope.selectedModel.editor.shadowIntensity,
            stageLightIntensity: $scope.selectedModel.editor.stageLightIntensity,
            enablePmrem: $scope.selectedModel.editor.enablePmrem,
            bgColor: $scope.selectedModel.editor.bgColor,
            selectedEnvironment: $scope.selectedModel.editor.selectedEnvironment.id
        }

        modelSrv.updateEditorSettings($scope.selectedModel, settingsToSave).then(function(model) {
            alert("settings saved successfully");
        }, function(err) {
            console.error(err);
            alert("error in saving settings");
        });
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

        let defaultEnvId = "otCxXiSe6F";
        defaultSettings.selectedEnvironment = getEnvironmentById(envs, defaultEnvId)

        return defaultSettings;
    }

    function getEnvironmentById(envs, id) {
        for (let i = 0; i < envs.length; i++) {
            if (envs[i].id === id) {
                return envs[i];
            }
        }

        // getting here means env was not found
        return null;
    }

});