'use strict'

define([
  'TocController',
  'SearchController',
  'TopicNavigatorController',
  'HelpController',
  'jquery'
], function (
  TocController,
  SearchController,
  TopicNavigatorController,
  HelpController,
  $
) {
  const indexAttr = $("link[rel=index]").attr('href')
  if (indexAttr && window.history) {
    var index = new URI(indexAttr).absoluteTo(window.location.href).href()
    $.ajax({
      url: index,
      success: (data) => {
        const $toc = $("<body>").append($.parseHTML(data)).find('nav')
        TocController($toc, index)
        const searchController = SearchController($toc, index)
        const topicNavigatorController = TopicNavigatorController($toc, index)
        const helpController = HelpController()

        const activationKeys = {
          115: searchController,
          116: topicNavigatorController,
          63: helpController
        }
        $(document).keypress(openSearch)

        function openSearch(event) {
          const $target = $(event.target)
          const key = event.which
          if ($target.is(':input') || $('.modal:visible').length !== 0 || !!event.metaKey) {
            // ignore
          // } else if (key === 115) {
          //   event.preventDefault()
          //   event.stopPropagation()
          //
          //   $fullTextSearch.focus()
          } else {
            const c = activationKeys[key]
            if (c) {
              event.preventDefault()
              event.stopPropagation()
              c.show()
            }
          }
        }
      }
    })
  }
})
