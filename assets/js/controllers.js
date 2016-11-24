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

  var mainCtrl = function($scope, $location) {
    //$scope.name = '';
    $scope.go = function ( path ) {
      $location.path( path + '/'+$scope.name );
    };
  };

  var playCtrl = function($scope, $routeParams, Word) {
    if(!$routeParams.pName){
      $location.path( '#/' );
    }
    $scope.player = $routeParams.pName;

    //$scope.wordsBd = Word.query();
    $scope.wordsBd = '';

    Word.query().$promise.then(
      //Success
      function (data) {
        $scope.wordsBd = data;
        $scope.reset();
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

    var checkForEndOfGame = function() {
      $scope.win = _.reduce($scope.secretWord, function(acc, letter) {
        return acc && letter.chosen;
      }, true);

      if (!$scope.win && $scope.numMisses === $scope.missesAllowed) {
        $scope.lost = true;
        revealSecret();
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
    .controller('mainCtrl', mainCtrl)
    .controller('playCtrl', playCtrl);

})();
