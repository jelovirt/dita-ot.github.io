'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const through = require('through2')
const gutil = require('gulp-util')
const PluginError = gutil.PluginError
const striptags = require('striptags')
const elasticlunr = require('elasticlunr')

function indexDocument(dir, indexFile) {
  const results = []
  var firstFile

  return through({objectMode: true}, readFile, indexFiles)

  function readFile(file, enc, callback) {
    if(file.isNull() || file.isDirectory()) {
      return this.push(file)
    }
    if(['.html'].indexOf(path.extname(file.path)) === -1) {
      return this.emit('error', new PluginError({
        plugin: 'Index',
        message: 'Only HTML supported.'
      }))
    }
    if(file.isStream()) {
      return this.emit('error', new PluginError({
        plugin: 'Index',
        message: 'Streams are not supported.'
      }))
    }

    if(file.isBuffer()) {
      if(!firstFile) {
        firstFile = file
      }

      const url = dir + '/' + file.relative.replace('\\', '/')
      const content = fs.readFileSync(file.path, {encoding: 'UTF-8'})

      results.push({
        url: url,
        title: 'foo',
        body: striptags(content)
      })
    }

    callback()
  }

  function indexFiles(callback) {
    const index = createIndex()

    const output = new gutil.File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: path.join(firstFile.base, indexFile),
      contents: Buffer.from(JSON.stringify(index.toJSON()))
    })

    this.emit('data', output)
    this.emit('end')

    callback()
  }

  function createIndex() {
    const index = elasticlunr(function () {
      this.addField('title')
      this.addField('body')
      this.setRef('url')
      this.saveDocument(false)
    })

    results.forEach((topic) => {
      const doc = {
        title: topic.title,
        body: topic.body,
        url: topic.url
      }
      index.addDoc(doc)
    })

    return index
  }

}

module.exports = indexDocument
