#!/usr/bin/env node

'use strict'

process.on('unhandledRejection', err => { throw err })

let got = require('got')
let cheerio = require('cheerio')

let href = process.argv.pop()

got.get(href).then(res => {
  let $ = cheerio.load(res.body)
  let $sections = $('.section-inner').toArray()

  for (let section of $sections) {
    let $els = $(section).find('h3, h4, p').toArray()
    for (let el of $els) {
      let match = el.name.match(/^h(\d)$/i)
      if (match) process.stdout.write('#'.repeat(match[1]) + ' ')

      let $as = $(el).find('a[href]').toArray()
      for (let a of $as) {
        let href = $(a).attr('href')
        let text = $(a).text()

        $(a).text(`[${text}](${href})`)
      }

      process.stdout.write(`${$(el).text()}\n\n`)
    }
  }
})
