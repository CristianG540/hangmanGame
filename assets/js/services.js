(function(){
  angular.module('hangApp.services', ['ngResource']);

  var post = function ($resource, BaseUrl) {
    return $resource(BaseUrl + '/posts/:postId', { postId: '@_id' });
  };

  var word = function ($resource, BaseUrl) {
    return $resource(BaseUrl + '/word/:wordId', { wordId: '@_id' });
  };

  var user = function ($resource, BaseUrl) {
    return $resource(BaseUrl + '/users/:userId', { userId: '@_id' });
  };

  angular
    .module('hangApp.services')
    //.constant('BaseUrl', 'http://jsonplaceholder.typicode.com')
    .constant('BaseUrl', location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: ''))
    .factory('Post', post)
    .factory('Word', word)
    .factory('User', user);


})();
