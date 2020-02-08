'use strict'
/* global angular XMLHttpRequest */
angular.module('canoeApp.services')
  .factory('aliasService', function ($log, $rootScope, configService, platformInfo, storageService, gettextCatalog, lodash) {
    var root = {}

    var host = 'https://alias.betawallet.bitcoinblack.info/api'

    var timer = null

    root.lookupAlias = function (alias, cb) {
      // If we were already waiting to perform a lookup, clear it
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(function () {
        root.actualLookupAlias(alias, cb)
      }, 500)
    }

    root.lookupAddress = function (address, cb) {
      // If we were already waiting to perform a lookup, clear it
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(function () {
        root.actualLookupAddress(address, cb)
      }, 500)
    }

    root.actualLookupAlias = function (alias, cb) {
      $log.debug('Perform lookup')
      var xhr = new XMLHttpRequest()
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.withCredentials = false
      xhr.open('GET', host + '/alias/' + alias, true)
      xhr.onerror = xhr.onabort = xhr.ontimeout = function () { cb('Lookup failed') }
      xhr.onload = function () {
        var response
        if (xhr.status === 422) {
          $log.debug('No such alias')
          response = JSON.parse(xhr.responseText)
          cb(response.message)
        } else if (xhr.status === 200) {
          response = JSON.parse(xhr.responseText)
          if (response.status === 'SUCCESS') {
            $log.debug('Success: ' + JSON.stringify(response.data))
            cb(null, response.data)
          } else if (response.status === 'ERROR') {
            $log.debug('Error: ' + JSON.stringify(response.message))
            cb(response.message)
          }
        } else {
          cb(xhr.status)
        }
      }
      xhr.send(null)
    }

    root.actualLookupAddress = function (address, cb) {
      $log.debug('Perform lookup')
      var xhr = new XMLHttpRequest()
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.withCredentials = false
      xhr.open('GET', host + '/address/' + address, true)
      xhr.onerror = xhr.onabort = xhr.ontimeout = function () { cb('Lookup failed') }
      xhr.onload = function () {
        if (xhr.status === 422) {
          $log.debug('No such address')
          cb('No such address')
        } else if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText)
          if (response.status === 'SUCCESS') {
            $log.debug('Success: ' + JSON.stringify(response.data))
            cb(null, response.data)
          } else if (response.status === 'ERROR') {
            $log.debug('Error: ' + JSON.stringify(response.message))
            cb(response.message)
          }
        } else {
          cb(xhr.status)
        }
      }
      xhr.send(null)
    }

    root.getAvatar = function (alias, cb) {
      $log.debug('Perform avatar lookup')
      var params = `alias=${alias}&type=png&size=70`
      var xhr = new XMLHttpRequest()
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.withCredentials = false
      xhr.open('POST', host + '/alias/avatar', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onerror = xhr.onabort = xhr.ontimeout = function () { cb('Lookup failed') }
      xhr.onload = function () {
        if (xhr.status === 422) {
          $log.debug('No such alias')
          cb('No such alias')
        } else if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText)
          if (response.status === 'SUCCESS') {
            $log.debug('Success: ' + JSON.stringify(response.data.avatar))
            cb(null, response.data.avatar)
          } else if (response.status === 'ERROR') {
            $log.debug('Error: ' + JSON.stringify(response.message))
            cb(response.message)
          }
        } else {
          cb(xhr.status)
        }
      }
      xhr.send(params)
    }

    root.createAlias = function (alias, address, email, isPrivate, signature, cb) {
      $log.debug('Perform Alias Creation')
      var params = `alias=${alias}&address=${address}&email=${email}&listed=${!isPrivate}&signature=${signature}`
      var xhr = new XMLHttpRequest()
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.withCredentials = false
      xhr.open('POST', host + '/alias/create', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onerror = xhr.onabort = xhr.ontimeout = function () { cb('Creation failed') }
      xhr.onreadystatechange = function () {
        var response
        if (this.status === 422) {
          response = JSON.parse(this.responseText)
          $log.debug(response.message)
          cb(response.message)
        } else if (this.status === 200) {
          response = JSON.parse(this.responseText)
          if (response.status === 'SUCCESS') {
            $log.debug('Success: ' + JSON.stringify(response.data))
            cb(null, response.data)
          } else if (response.status === 'ERROR') {
            $log.debug('Error: ' + JSON.stringify(response.message))
            cb(response.message)
          }
        } else {
          cb(xhr.status)
        }
      }
      xhr.send(params)
    }

    root.editAlias = function (alias, newAlias, address, email, isPrivate, newSignature, privateSignature, cb) {
      $log.debug('Perform Alias Editing')
      var params = `alias=${alias}&newAlias=${newAlias}&address=${address}&email=${email}&listed=${!isPrivate}&newSignature=${newSignature}&privateSignature=${privateSignature}`
      var xhr = new XMLHttpRequest()
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.withCredentials = false
      xhr.open('POST', host + '/alias/edit', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onerror = xhr.onabort = xhr.ontimeout = function () { cb('Editing failed') }
      xhr.onreadystatechange = function () {
        var response
        if (this.status === 422) {
          response = JSON.parse(this.responseText)
          $log.debug(response.message)
          cb(response.message)
        } else if (this.status === 200) {
          response = JSON.parse(this.responseText)
          if (response.status === 'SUCCESS') {
            $log.debug('Success: ' + JSON.stringify(response.data))
            cb(null, response.data)
          } else if (response.status === 'ERROR') {
            $log.debug('Error: ' + JSON.stringify(response.message))
            cb(response.message)
          }
        } else {
          cb(xhr.status)
        }
      }
      xhr.send(params)
    }

    return root
  })