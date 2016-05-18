'use strict';define(['SearchView','Common','jquery','elasticlunr'],function(SearchView,Common,$,elasticlunr){return function SearchController($toc,index){var common=Common(index);var view=SearchView(doFullTextQuery,common.loadMain,'tocSearch');var titles=getTitles($toc);var queryIndex;var indexUrl=new URI(index+'/../index.json').normalize().href();console.log(indexUrl);$.ajax({url:indexUrl,success:function success(data){init(data);}});return {show:view.show};function init(queryIndexJson){queryIndex=createIndex(queryIndexJson);}function createIndex(queryIndexJson){return elasticlunr.Index.load(queryIndexJson);}var searchConfiguration={fields:{title:{boost:2},body:{boost:1}},bool:"AND",expand:true};function doFullTextQuery(value){return queryIndex.search(value,searchConfiguration).map(function(match){return titles[match.ref];});}function getTitles($toc){return _.keyBy($toc.find('a').map(function(){var $node=$(this);return {title:$.trim($node.text()),url:new URI($node.attr('href')).absoluteTo(index).href()};}).toArray(),function(topic){return new URI(topic.url).path();});}};});