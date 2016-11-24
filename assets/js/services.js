(function(){
  angular.module('hangApp.services', ['ngResource']);

  var word = function ($resource, BaseUrl) {
    return $resource(BaseUrl + '/word/:wordId', { wordId: '@_id' });
  };

  var user = function ($resource, BaseUrl) {
    return $resource(BaseUrl + '/user/:id', null, {
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    });
  };

  angular
    .module('hangApp.services')
    //.constant('BaseUrl', 'http://jsonplaceholder.typicode.com')
    .constant('BaseUrl', location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: ''))
    .factory('Word', word)
    .factory('User', user);


})();
