(function(){

  angular.module('hangApp', ['ngRoute', 'ui.bootstrap', 'hangApp.controllers']);

  var config = function ($locationProvider, $routeProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '/templates/home.html',
        controller: 'mainCtrl'
      })
      .when('/play/:pName', {
        templateUrl : 'templates/play.html',
        controller  : 'playCtrl'
      })
      .when('/addWord', {
        templateUrl : 'templates/add-word.html',
        controller  : 'addWordCtrl'
      })
      .when('/leaderboard', {
        templateUrl : 'templates/leader.html',
        controller  : 'leaderBoardCtrl'
      })
      .otherwise({
        redirectTo: '/',
        caseInsensitiveMatch: true
      });
  };

  angular
    .module('hangApp')
    .config(config);

})();

/*todoApp.controller('TodoCtrl', ['$scope', '$rootScope', 'TodoService', function($scope, $rootScope, TodoService) {
  $scope.formData = {};
  $scope.todos = [];

  TodoService.getTodos().then(function(response) {
    $scope.todos = response;
  });

  $scope.addTodo = function() {
    TodoService.addTodo($scope.formData).then(function(response) {
      $scope.todos.push($scope.formData);
      $scope.formData = {};
    });
  };

  $scope.removeTodo = function(todo) {
    TodoService.removeTodo(todo).then(function(response) {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    });
  };
}]);*/
