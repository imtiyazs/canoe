'use strict'
/* global angular */
angular.module('canoeApp.controllers').controller('addressbookListController', function ($scope, $log, $timeout, addressbookService, lodash, popupService, gettextCatalog, platformInfo) {
  var contacts

  var initAddressbook = function () {
    addressbookService.list(function (err, ab) {
      if (err) $log.error(err)

      $scope.isEmptyList = lodash.isEmpty(ab)

      if (!$scope.isEmptyList) $scope.showAddIcon = true
      else $scope.showAddIcon = false

      contacts = []
      lodash.each(ab, function (v, k) {
        contacts.push({
          name: lodash.isObject(v) ? v.name : v,
          address: k,
          email: lodash.isObject(v) ? v.email : null,
          alias: lodash.isObject(v) ? v.alias.alias : null,
          avatar: lodash.isObject(v) ? v.avatar : null
        })
      })
      $scope.addressbook = lodash.clone(contacts)
      $timeout(function () {
        $scope.$apply()
      })
      $log.error('Sddress List: ',JSON.stringify(contacts))
      $log.error('length :',contacts.length)

      if (contacts !== 'undefined' && contacts.length > 0) {
        for (var i = 0; i < contacts.length; i++) {
          if (!contacts[i].name.length || !contacts[i].address.length){
            $log.error('GGG address :',contacts[i])
          }
        }
      }

    })
  }

  $scope.findAddressbook = function (search) {
    if (!search || search.length < 2) {
      $scope.addressbook = contacts
      $timeout(function () {
        $scope.$apply()
      }, 10)
      return
    }

    var result = lodash.filter(contacts, function (item) {
      var val = item.name
      return lodash.includes(val.toLowerCase(), search.toLowerCase())
    })

    $scope.addressbook = result
  }

  $scope.$on('$ionicView.beforeEnter', function (event, data) {
    $scope.isChromeApp = platformInfo.isChromeApp
    $scope.showAddIcon = false
    $scope.addrSearch = { value: null }
    initAddressbook()
  })
})
