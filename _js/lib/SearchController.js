'use strict'

define([
  'Common',
  'jquery',
  'jquery',
  'elasticlunr',
  'bootstrap'
], function (
  Common,
  $,
  jQuery,
  elasticlunr
) {
  return function SearchController($toc, index) {
    const common = Common(index)
    const titles = getTitles($toc)
    const $fullTextSearch = $('#search :input[name=q]')
    const $searchInput = $('#tocSearchInput')
    const $modal = $('#tocSearch')
    const $body = $modal.find('.modal-body')
    var isModelActive = false
    var currentResult = -1
    $modal.modal({show: false})
      .on('shown.bs.modal', onShow)
      .on('hidden.bs.modal', onHide)
    $searchInput.keyup(onType)
    var queryIndex

    var indexUrl = new URI('/dev/index.json').absoluteTo(window.location.href).href()
    $.ajax({
      url: indexUrl,
      success: (data) => {
        init(data)
      }
    })

    function init(queryIndexJson) {
      queryIndex = createIndex(queryIndexJson)

      $(document).keypress(openSearch)
      $(document).keydown(resultNavigation)
    }

    function createIndex(queryIndexJson) {
      return elasticlunr.Index.load(queryIndexJson)
    }

    function onType(event) {
      if (event.which === 37 || event.which === 39) {
        return
      }

      const value = $searchInput.val()
      if (value.length === 0) {
        $body.empty()
        $modal.modal('handleUpdate')
      } else {
        const results = doFullTextQuery(value)
        if (results.length === 0) {
          $body.html('<p class="text-center">No matching topics found.</p>')
        } else {
          $body.html(results.map(createResult))
        }
      }
      currentResult = -1
      $modal.modal('handleUpdate')

      function doQuery(value) {
        const query = buildQuery(value)
        let results = titles.filter(query.exact)
        if (results.length === 0) {
          results = titles.filter(query.lax)
        }
        return results
      }

      const searchConfiguration = {
        fields: {
          title: {boost: 2},
          body: {boost: 1}
        },
        bool: "AND",
        expand: true
      }

      function doFullTextQuery(value) {
        return queryIndex
          .search(value, searchConfiguration)
          .map((match) => titles[match.ref])
      }

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
          common.loadMain(href)
          $modal.modal('hide')
        }
      }

      function buildQuery(value) {
        const chars = value
          .trim()
          .split('')
          .map((c) => {
            switch (c) {
              case '.':
              case '\\':
              case '^':
              case '$':
              case '[':
              case ']':
              case '?':
              case '*':
              case '+':
                return `\\${c}`
              case ' ':
                return '\\w+'
              default:
                return c
            }
          })
        const exact = new RegExp(chars.join(''), 'gi')
        const lax = new RegExp(chars.join('.*?'), 'gi')
        return {
          exact: (node) => { return exact.test(node.title) },
          lax: (node) => { return lax.test(node.title) }
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

    function openSearch(event) {
      const $target = $(event.target)
      const key = event.which
      if ($target.is(':input') || $('.modal:visible').length !== 0 || !!event.metaKey) {
        // ignore
      } else if (key === 116) {
        event.preventDefault()
        event.stopPropagation()

        $modal.modal('show')
      } else if (key === 115) {
        event.preventDefault()
        event.stopPropagation()

        $fullTextSearch.focus()
      }
    }

    function resultNavigation(event) {
      if (isModelActive) {
        switch (event.keyCode) {
          case 40:
            currentResult++
            const results = $body.find('a')
            if (currentResult >= results.length) {
              currentResult = results.length - 1
            }
            results[currentResult].focus()
            event.preventDefault()
            event.stopPropagation()
            break;
          case 38:
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

    function getTitles($toc) {
      return _.keyBy($toc
        .find('a')
        .map(function () {
          const $node = $(this)
          return {
            title: $.trim($node.text()),
            url: new URI($node.attr('href')).absoluteTo(index).href()
          }
        })
        .toArray(),
        function(topic) {
          return new URI(topic.url).path()
        })
    }
  }
});
