(function(){

  var addWordCtrl = function($scope, Word){
    $scope.words = Word.query();

    $scope.create = function(){
      Word.save($scope.word).$promise.then(
        //Success
        function (data) {
          $scope.words.push(data);
          $scope.word = '';
        },
        //Error
        function (error) {
          var details = error.data.details;
          alert(details.split("•")[2]);
          console.log(error);
          $scope.word = '';
        }
      );

    };

  };

  var leaderBoardCtrl = function($scope, User){
    $scope.users = User.query();
  };

  var mainCtrl = function($scope, $location) {
    //$scope.name = '';
    $scope.go = function ( path ) {
      if($scope.name.indexOf('_') !== -1){
        $location.path( path + '/'+$scope.name );
      }else{
        $location.path( path + '/'+$scope.name+'_'+Math.random().toString(36).substr(2, 5) );
      }
    };
  };

  var playCtrl = function($scope, $location, $routeParams, $http, Word, User) {

    if(!$routeParams.pName){
      $location.path( '#/' );
    }
    $scope.player = $routeParams.pName;

    //$scope.wordsBd = Word.query();
    $scope.wordsBd = '';

    Word.query().$promise.then(
      //Success
      function (data) {
        if(data.length <= 0){
          $location.path( '/addWord' );
        }else{
          $scope.wordsBd = data;
          $scope.reset();
        }
      },
      //Error
      function (error) {
        console.log(error);
      }
    );

    $scope.missesAllowed = 6;

    var getRandomWord = function() {
      var index = Math.floor(Math.random() * $scope.wordsBd.length);
      return $scope.wordsBd[index].value;
    };

    var makeLetters = function(word) {
      return _.map(word.split(''), function(character) {
        return { name: character, chosen: false };
      });
    };

    var revealSecret = function() {
      _.each($scope.secretWord, function(letter) {
        letter.chosen = true;
      });
    };

    var checkPlayer = function(){
      $http({method: 'GET', url: '/user?name='+$scope.player})
        .success(function(data, status, headers, config) {
          if(data.length > 0){
            User.update({ id : data[0].id }, {
              name: data[0].name,
              wins: ($scope.win) ? data[0].wins+1 : data[0].wins,
              losses: ($scope.lost) ? data[0].losses+1 : data[0].losses
            }).$promise.then(
              function (data) {
                console.log('success', data);
              },
              function (error) {
                console.log(error);
              }
            );
          }else{
            User.save({
              name: $scope.player,
              wins: ($scope.win) ? 1 : 0,
              losses: ($scope.lost) ? 1 : 0
            }).$promise.then(
              function (data) {
                console.log('success', data);
              },
              function (error) {
                console.log(error);
              }
            );
          }
        })
        .error(function(data, status, headers, config) {
          console.log(data);
        });
    };

    var checkForEndOfGame = function() {
      $scope.win = _.reduce($scope.secretWord, function(acc, letter) {
        return acc && letter.chosen;
      }, true);

      if (!$scope.win && $scope.numMisses === $scope.missesAllowed) {
        $scope.lost = true;
        revealSecret();
      }
      if($scope.win || $scope.lost){
        checkPlayer();
      }
    };

    $scope.reset = function() {
      _.each($scope.letters, function(letter) {
        letter.chosen = false;
      });
      $scope.secretWord = makeLetters(getRandomWord());
      $scope.numMisses = 0;
      $scope.win = false;
      $scope.lost = false;
    };

    $scope.try = function(guess) {
      guess.chosen = true;
      var found = false;
      _.each($scope.secretWord,
             function(letter) {
               if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                 letter.chosen = true;
                 found = true;
               }
             });
      if (!found) {
        $scope.numMisses++;
      }
      checkForEndOfGame();
    };

    $scope.letters = makeLetters("abcdefghijklmnopqrstuvwxyz");
  };

  angular
    .module('hangApp.controllers', ['hangApp.services'])
    .controller('addWordCtrl', addWordCtrl)
    .controller('leaderBoardCtrl', leaderBoardCtrl)
    .controller('mainCtrl', mainCtrl)
    .controller('playCtrl', playCtrl);

})();
