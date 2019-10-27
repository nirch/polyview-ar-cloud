var app = angular.module("arCloudAdminApp", ["ngRoute", "ngImageInputWithPreview", "ui.bootstrap"]);

app.config(function($routeProvider) {
    $routeProvider.
    when("/models", {
        templateUrl: "app/models/models.html",
        controller: "modelsCtrl"
    }).when("/models/:id" , {
        templateUrl: "app/models/modelDetails.html",
        controller: "modelDetailsCtrl"
    }).when("/categories", {
        templateUrl: "app/projects/projects.html",
        controller: "projectsCtrl"
    }).when("/categories/:id", {
      templateUrl: "app/projects/projectDetails.html",
      controller: "projectDetailsCtrl"
    })
});

app.directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.on('change', onChangeHandler);
        element.on('$destroy', function() {
          element.off();
        });
  
      }
    };
  });