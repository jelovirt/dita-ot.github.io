'use strict'

define([
  'jquery',
  'jquery',
  'bootstrap'
], function (
  $,
  jQuery
) {
  return function HelpController() {
    const view = HelpView()

    return {
      show: view.show
    }
  }

  function HelpView() {
    const $help = $('#keyboardHelp')
    $help.modal({show: false})

    return {
      show: function() {
        $help.modal('show')
      }
    }
  }
})
