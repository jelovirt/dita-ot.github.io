'use strict'

define([
  'SearchView',
  'Common',
  'jquery',
  'elasticlunr'
], function (
  SearchView,
  Common,
  $,
  elasticlunr
) {
  return function SearchController($toc, index) {
    const common = Common(index)
    const view = SearchView(doFullTextQuery, common.loadMain, 'tocSearch')
    const titles = getTitles($toc)
    var queryIndex

    var indexUrl = new URI('/dev/index.json').absoluteTo(window.location.href).href()
    $.ajax({
      url: indexUrl,
      success: (data) => {
        init(data)
      }
    })

    return {
      activationKey: 115, // t
      show: view.show
    }

    function init(queryIndexJson) {
      queryIndex = createIndex(queryIndexJson)
    }

    function createIndex(queryIndexJson) {
      return elasticlunr.Index.load(queryIndexJson)
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
