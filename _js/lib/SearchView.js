'use strict'

define([
  'jquery',
  'jquery',
  'bootstrap'
], function (
  $,
  jQuery
) {
  return function SearchView(doQuery, loadMain, modalId) {
    const KEY_LEFT = 37
    const KEY_UP = 38
    const KEY_RIGHT = 39
    const KEY_DOWN = 40

    const $modal = $('#' + modalId)
    const $searchInput = $modal.find('input')
    const $body = $modal.find('.modal-body')

    var isModelActive = false
    var currentResult = -1

    $modal.modal({show: false})
      .on('shown.bs.modal', onShow)
      .on('hidden.bs.modal', onHide)
    $searchInput.keyup(onType)
    $(document).keydown(resultNavigation)

    return {
      show: show
    }

    function onType(event) {
      if (event.which === KEY_LEFT || event.which === KEY_RIGHT) {
        return
      }

      const value = $searchInput.val()
      if (value.length === 0) {
        $body.empty()
        $modal.modal('handleUpdate')
      } else {
        const results = doQuery(value)
        console.log('results', results)
        if (results.length === 0) {
          $body.html('<p class="text-center">No matching topics found.</p>')
        } else {
          $body.html(results.map(createResult))
        }
      }
      currentResult = -1
      $modal.modal('handleUpdate')

      function createResult(node) {
        return $(`<p><a></a></p>`)
          .find('a')
          .attr('href', node.url)
          .text(node.title)
          .click(selectResult)
          .end()

        function selectResult(event) {
          event.preventDefault()
          event.stopPropagation()

          const $target = $(event.target)
          const href = $target.get(0).href
          loadMain(href)
          $modal.modal('hide')
        }
      }
    }

    function onShow() {
      isModelActive = true
      $searchInput.focus()
    }

    function onHide() {
      isModelActive = false
      $body.empty()
      $searchInput.val('')
    }

    function show() {
      $modal.modal('show')
    }

    function resultNavigation(event) {
      if (isModelActive) {
        switch (event.keyCode) {
          case KEY_DOWN:
            currentResult++
            const results = $body.find('a')
            if (currentResult >= results.length) {
              currentResult = results.length - 1
            }
            results[currentResult].focus()
            event.preventDefault()
            event.stopPropagation()
            break;
          case KEY_UP:
            currentResult--
            if (currentResult < 0) {
              currentResult = -1
            } else if (currentResult === -1) {
              $searchInput.focus()
            } else {
              $body.find('a')[currentResult].focus()
            }
            event.preventDefault()
            event.stopPropagation()
            break;
        }
      }
    }
  }
});
