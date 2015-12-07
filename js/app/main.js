'use strict';

define([
//'rx',
// TODO: should lodash and JQuery just be loaded outside Require.js?
'lodash', 'jquery'
//'uri'
], function (
//Rx,
_, $) {
  var CLASS_OPEN = 'expanded';
  var CLASS_CLOSED = 'collapsed';

  var index = new URI($("link[rel=index]").attr('href')).absoluteTo(window.location.href).href();
  var base = new URI('.').absoluteTo(index).href();
  console.log(index, base);

  var $nav = $('nav[role=toc]');
  var $main = $('main[role=main]');

  initializeMain();
  addTocControllers();
  loadFullToc();

  function loadFullToc() {
    $.ajax({
      url: index,
      success: function success(data) {
        var $dummy = $("<body>").append($.parseHTML(data)).find('nav');
        initializeToc($dummy);
        $("nav[role=toc]").html($dummy.html());
        addTocControllers();
      }
    });

    function initializeToc($dummy) {
      var $current;
      $dummy.find('a').each(function () {
        var $a = $(this);
        var abs = new URI($a.attr('href')).absoluteTo(index).href();
        $a.attr('href', abs);
        if (abs === window.location.href) {
          $current = $a;
          $a.parent('li').addClass('active');
        }
      });
      if ($current) {
        $dummy.find('li').each(function () {
          toggleNode($(this));
        });
        $current.parents('li').each(function () {
          toggleNode($(this));
        });
      }
    }
  }

  function toggleNode($node) {
    if ($node.hasClass(CLASS_CLOSED)) {
      $node.addClass(CLASS_OPEN).removeClass(CLASS_CLOSED);
    } else {
      $node.addClass(CLASS_CLOSED).removeClass(CLASS_OPEN);
    }
  }

  function addTocControllers() {
    $nav.find("li").each(function () {
      var $li = $(this);
      if (!$li.hasClass(CLASS_OPEN)) {
        $li.addClass(CLASS_OPEN);
      }
      if ($li.children('ul').length) {
        $('<span class="controller"></span>').click(toggleHandler).prependTo($li);
      }
      $li.children('a').filter(isLocal).click(navigateHandler);
    });

    function toggleHandler(event) {
      var $target = $(event.target);
      var $node = $target.parent('li');
      toggleNode($node);
    }

    function navigateHandler(event) {
      event.preventDefault();
      event.stopPropagation();

      var $target = $(event.target);
      var href = $target.get(0).href;
      loadMain(href, $target);
    }
  }

  function loadMain(href, $tocLink) {
    $.ajax({
      url: href,
      success: function success(data) {
        updateMain(data);
        updateToc(href, $tocLink);
      }
    });

    function updateToc(href, $tocLink) {
      $nav.find('.active').removeClass('active');
      if ($tocLink !== undefined) {
        $tocLink.parent('li').addClass('active');
      } else {
        var abs = new URI(href).absoluteTo(window.location.href).href();
        $nav.find('a[href="' + abs + '"]').parent('li').addClass('active');
      }
      window.history.pushState({}, "", href);
    }

    function updateMain(data) {
      var $dummy = $("<body>").append($.parseHTML(data));
      $main.html($dummy.find('[role=main]:first').html());
      initializeMain();
    }
  }

  function initializeMain() {
    $main.find('a').filter(isLocal).click(mainClickHandler);
  }

  function isLocal() {
    var $a = $(this);
    var abs = new URI($a.attr('href')).absoluteTo(window.location.href).href();
    return abs.indexOf(base) !== -1;
  }

  function mainClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    var $target = $(event.target);
    var href = $target.attr('href');
    loadMain(href);
  }
});