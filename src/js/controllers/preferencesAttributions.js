'use strict'

angular.module('canoeApp.controllers').controller('preferencesAttributions',
  function ($scope, externalLinkService) {
    $scope.openExternalDirect = function (url, target) {
      externalLinkService.open(url, target)
    }
  })
