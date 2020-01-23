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
        $scope.toggleAnimation();
        $scope.updateEnvImage();
    });
    });


    // $scope.togglePmrem = function () {
    //     var modelViewerElement = angular.element(document.querySelector('#viewer'));
    //     if ($scope.editorSettings.enablePmrem) {
    //         // adding attribute
    //         modelViewerElement.attr("experimental-pmrem", "");
    //     } else {
    //         // removing attribute
    //         modelViewerElement.removeAttr("experimental-pmrem");
    //     }
    // }

    $scope.toggleAnimation = function () {
        var modelViewerElement = angular.element(document.querySelector('#viewer'));
        if ($scope.editorSettings.enableAnimation) {
            // adding attribute
            modelViewerElement.attr("autoplay", "");
        } else {
            // removing attribute
            modelViewerElement.removeAttr("autoplay");
            // document.querySelector('#viewer').currentTime = 0;
            document.querySelector('#viewer').pause();
        }
    }

    $scope.updateEnvImage = function() {
        var modelViewerElement = angular.element(document.querySelector('#viewer'));
        if ($scope.editorSettings.selectedEnvironment) {
            // adding attribute
            modelViewerElement.attr("environment-image", $scope.editorSettings.selectedEnvironment.imageUrl);
        } else {
            // removing attribute
            modelViewerElement.removeAttr("environment-image");
        }
    }


    $scope.applyChanges = function () {
        let settingsToSave = undefined;

        // If the settings to save are the default ones than saving 'undefined'
        if (!$scope.isDefault()) {
            settingsToSave = {
                exposure: $scope.editorSettings.exposure,
                shadowIntensity: $scope.editorSettings.shadowIntensity,
                bgColor: $scope.editorSettings.bgColor,
                environmentId: $scope.editorSettings.selectedEnvironment ? $scope.editorSettings.selectedEnvironment.id : "",
                enableAnimation: $scope.editorSettings.enableAnimation,
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
        $scope.toggleAnimation();	
        $scope.updateEnvImage();
    }

    function isSettingsEqual(settings1, settings2) {
        if (
            settings1.exposure === settings2.exposure &&
            settings1.shadowIntensity === settings2.shadowIntensity &&
            settings1.bgColor === settings2.bgColor &&
            settings1.enableAnimation === settings2.enableAnimation &&
            (
                !settings1.selectedEnvironment && !settings2.selectedEnvironment ||
                settings1.selectedEnvironment && settings2.selectedEnvironment && settings1.selectedEnvironment.id === settings2.selectedEnvironment.id
            )
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
                exposure: $scope.selectedModel.editor.exposure !== undefined ? $scope.selectedModel.editor.exposure : 1,
                shadowIntensity: $scope.selectedModel.editor.shadowIntensity,
                bgColor: $scope.selectedModel.editor.bgColor,
                selectedEnvironment: getEnvironmentById($scope.selectedModel.editor.environmentId),
                enableAnimation: $scope.selectedModel.editor.enableAnimation !== undefined ? $scope.selectedModel.editor.enableAnimation : true
            }
        }

        return settings;
    }

    // Getting the default env settings
    function getDefaultEditorSettings() {
        let defaultSettings = {
            exposure: 1,
            shadowIntensity: 1,
            bgColor: "#ffffff",
            enableAnimation: true
        }

        let defaultEnvId = "mGFelCGvy9";
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