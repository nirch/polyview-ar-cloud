app.controller("modelEditorCtrl", function ($scope, environmentSrv, $routeParams, modelSrv, $sce) {

    $scope.selectedModel = null;
    $scope.selectedModelSecureUrl = null;
    $scope.editorSettings = {};
    $scope.showSuccessAlert = false;
    $scope.showErrorAlert = false;


    // Loading environments
    environmentSrv.getAll().then(environments => {
        $scope.environments = environments;

        // Loading model
        modelSrv.getById($routeParams.id).then(model => {
        $scope.selectedModel = model;
        $scope.selectedModelSecureUrl = $sce.trustAsResourceUrl($scope.selectedModel.gltfUrl);
        $scope.editorSettings = getSelectedModelEditorSettings();
        $scope.togglePmrem();
    });
    });


    $scope.togglePmrem = function () {
        var modelViewerElement = angular.element(document.querySelector('#viewer'));
        if ($scope.editorSettings.enablePmrem) {
            // adding attribute
            modelViewerElement.attr("experimental-pmrem", "");
        } else {
            // removing attribute
            modelViewerElement.removeAttr("experimental-pmrem");
        }
    }

    $scope.applyChanges = function () {
        let settingsToSave = undefined;

        // If the settings to save are the default ones than saving 'undefined'
        if (!$scope.isDefault()) {
            settingsToSave = {
                envIntensity: $scope.editorSettings.envIntensity,
                shadowIntensity: $scope.editorSettings.shadowIntensity,
                stageLightIntensity: $scope.editorSettings.stageLightIntensity,
                enablePmrem: $scope.editorSettings.enablePmrem,
                bgColor: $scope.editorSettings.bgColor,
                environmentId: $scope.editorSettings.selectedEnvironment.id
            }
        }

        modelSrv.updateEditorSettings($scope.selectedModel, settingsToSave).then(function (model) {
            console.log("settings saved successfully");
            $scope.showSuccessAlert = true;
        }, function (err) {
            console.error(err);
            console.log("error in saving settings");
            $scope.showErrorAlert = true;
        });
    }

    // checking if the saved state and the current state are equal. If not equal than the state is dirty
    $scope.isDirty = function () {
        if (!$scope.selectedModel) {
            return false;
        }

        let savedModelSettings = getSelectedModelEditorSettings();
        return !isSettingsEqual(savedModelSettings, $scope.editorSettings);
    }

    // returns true if the current settings are the default settings
    $scope.isDefault = function () {
        if (!$scope.selectedModel) {
            return true;
        }

        let defaultSettings = getDefaultEditorSettings();
        return isSettingsEqual(defaultSettings, $scope.editorSettings);
    }

    // Restoring the editor settings to the default state (still user needs to save)
    $scope.restoreDefaults = function () {
        $scope.editorSettings = getDefaultEditorSettings();
        $scope.togglePmrem();
    }

    function isSettingsEqual(settings1, settings2) {
        if (
            settings1.envIntensity === settings2.envIntensity &&
            settings1.shadowIntensity === settings2.shadowIntensity &&
            settings1.stageLightIntensity === settings2.stageLightIntensity &&
            settings1.enablePmrem === settings2.enablePmrem &&
            settings1.bgColor === settings2.bgColor &&
            settings1.selectedEnvironment.id === settings2.selectedEnvironment.id
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getSelectedModelEditorSettings() {
        let settings;

        if (!$scope.selectedModel.editor) {
            // Loading default settings
            settings = getDefaultEditorSettings();
        } else {
            // Loading saved settings
            settings = {
                envIntensity: $scope.selectedModel.editor.envIntensity,
                shadowIntensity: $scope.selectedModel.editor.shadowIntensity,
                stageLightIntensity: $scope.selectedModel.editor.stageLightIntensity,
                enablePmrem: $scope.selectedModel.editor.enablePmrem,
                bgColor: $scope.selectedModel.editor.bgColor,
                selectedEnvironment: getEnvironmentById($scope.selectedModel.editor.environmentId)
            }
        }

        return settings;
    }

    // Getting the default env settings
    function getDefaultEditorSettings() {
        let defaultSettings = {
            envIntensity: 2,
            shadowIntensity: 0.2,
            stageLightIntensity: 1,
            enablePmrem: true,
            bgColor: "#ffffff"
        }

        let defaultEnvId = "otCxXiSe6F";
        defaultSettings.selectedEnvironment = getEnvironmentById(defaultEnvId)

        return defaultSettings;
    }

    function getEnvironmentById(id) {
        for (let i = 0; i < $scope.environments.length; i++) {
            if ($scope.environments[i].id === id) {
                return $scope.environments[i];
            }
        }

        // getting here means env was not found
        return null;
    }

    $scope.closeAlert = function(type) {
        if (type === "success") {
            $scope.showSuccessAlert = false;
        } else if (type == "error") {
            $scope.showErrorAlert = false;
        }
    }

});