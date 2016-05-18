'use strict'

define([
  'Common',
  'SearchView',
  'jquery'
], function (
  Common,
  SearchView,
  $
) {
  return function TopicNavigationController($toc, index) {
    const common = Common(index)
    const view = SearchView(doQuery, common.loadMain, 'tocTopicNavigator')
    const titles = getTitles($toc)

    return {
      show: view.show
    }

    function doQuery(value) {
      const query = buildQuery(value)
      console.log(titles)
      let results = titles.filter(query.exact)
      if (results.length === 0) {
        results = titles.filter(query.lax)
      }
      return results
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

    function getTitles($toc) {
      return $toc
          .find('a')
          .map(function () {
            const $node = $(this)
            return {
              title: $.trim($node.text()),
              url: new URI($node.attr('href')).absoluteTo(index).href()
            }
          })
          .toArray()
    }
  }
});
