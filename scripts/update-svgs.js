const fs = require('fs')
const fetch = require('node-fetch')
const sharp = require('sharp')
const pngquant = require('pngquant')
const he = require('he')

const contributors = require('../data/contributors.json')
const sponsors = require('../data/sponsors.json')
const tiers = require('../data/tiers.json')

// Width of the resulting images
const WIDTH = 720

// Whether to make the SVG interactive
const INTERACTIVE = false

// Sort sponsors by tier
const sponsorsByTier = {}
{
  let lastAmount = Infinity
  for (const [tierId, tier] of Object.entries(tiers)) {
    sponsorsByTier[tierId] = sponsors.filter(item => item.amount >= tier.minAmount && item.amount < lastAmount)
    lastAmount = tier.minAmount
  }
}

function getImages(items, maxHeight, crop) {
  return Promise.all(items.map(item => (() => {
    let url = item.logo
    let maxHeightX2 = maxHeight + maxHeight // retina
    console.log(`[fetch] '${url}'`)
    return (
        /^https?:/.test(url)
          ? fetch(url).then(res => res.arrayBuffer())
          : fs.promises.readFile(__dirname + '/../src/.vuepress/public/' + url)
      )
      .then(buf => {
        let im = sharp(Buffer.from(buf)).resize(undefined, maxHeightX2)
        if (crop) im.extract({ left: 0, top: 0, width: maxHeightX2, height: maxHeightX2 })
        return im.png().toBuffer({ resolveWithObject: true })
      })
      .then(out =>
        new Promise((resolve, reject) => {
          const png = new pngquant([128, '--quality', '65-80'])
          const buf = []
          png.on('data', chunk => buf.push(chunk))
          png.on('end', () => {
            const data = Buffer.concat(buf)
            console.log(`[pngquant] minimized ${item.name}'s '${item.logo}' from ${out.data.length} to ${data.length} bytes`)
            out.data = data
            resolve(out)
          })
          png.on('error', err => {
            console.log(`[pngquant] error on ${item.name}'s '${item.logo}': ${err}`)
            resolve(out)
          })
          png.write(out.data)
        })
      )
      .then(out => {
        item.image = {
          data: out.data,
          width: out.info.width >>> 1,
          height: out.info.height >>> 1
        }
        return null
      })
      .catch(err => {
        console.error(`ERROR: ${err.stack}`)
        return err
      })
  })()))
}

Promise.all([
  getImages(sponsorsByTier.platinum, 80),
  getImages(sponsorsByTier.gold, 64),
  getImages(sponsorsByTier.silver, 48),
  getImages(sponsorsByTier.bronze, 36),
  getImages(sponsorsByTier.backer, 32, true),
  getImages(contributors, 32, true)
]).then(() => {
  fs.writeFileSync(__dirname + '/../src/.vuepress/public/sponsors.svg', buildSponsorsSVG(sponsorsByTier))
  fs.writeFileSync(__dirname + '/../src/.vuepress/public/contributors.svg', buildContributorsSVG(contributors))
})

function layoutItems(items, data, y) {
  if (!items) return
  let x = 0
  let maxHeight = 0
  let n = items.length

  function margin(height) {
    return 6 + ((height - 32) / 2) | 0
  }

  function row(items) {
    for (let item of items) {
      const image = item.image
      const isSmall = image.width == 32 && image.height == 32
      let clipPath = ''
      if (isSmall) {
        clipPath = ` clip-path="url('#circle')"`
      }
      if (INTERACTIVE) {
        data.push(`<a transform="translate(${x},${y})" href="${item.link}" target="_blank" rel="noopener"><title>${he.encode(item.name)}</title><g>`)
      } else {
        data.push(`<g transform="translate(${x},${y})">`)
      }
      if (isSmall) {
        data.push(`<circle cx="16" cy="16" r="17.5" stroke="#007acc" fill="#fff" stroke-width="1"></circle>`)
      }
      data.push(`<image width="${image.width}" height="${image.height}" href="data:image/png;base64,${image.data.toString('base64')}"${clipPath} />`)
      if (INTERACTIVE) {
        data.push(`<animateTransform attributeName="transform" type="translate" values="0 0;0 -3" begin="mouseover" dur="75ms" repeatCount="1" fill="freeze" />`)
        data.push(`<animateTransform attributeName="transform" type="translate" values="0 -3;0 0" begin="mouseout" dur="150ms" repeatCount="1" fill="freeze" />`)
        data.push(`</g></a>\n`)
      } else {
        data.push(`</g>\n`)
      }
      x += image.width + margin(image.height)
      if (image.height > maxHeight) maxHeight = image.height
    }
  }
  
  if (n) {
    let i = 0
    while (i < items.length) {
      const rowItems = []
      let w = 0
      while (i < items.length) {
        const item = items[i]
        const image = item.image
        if (image) {
          const newW = w + image.width + (w > 0 ? margin(image.height) : 0)
          if (newW >= WIDTH - 20) break // leave a little space around
          rowItems.push(item)
          w = newW
        }
        ++i
      }
      x = (WIDTH - w) >>> 1
      row(rowItems)
      y += maxHeight + margin(maxHeight)
      w = 0
    }
  }
  return y
}

function buildSponsorsSVG(sponsorsByTier) {
  const data = []
  data.push('<style>a { cursor: pointer; } a circle { pointer-events: none; } text { fill: #2c3e50; font-weight: 600; font-size: 21px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; }</style>\n')
  data.push(`<defs><clipPath id="circle"><circle cx="16" cy="16" r="15.5" /></clipPath></defs>\n`)
  data.push(`<rect width="100%" height="100%" fill="white"/>\n`)
  let y = 0
  Object.entries(tiers).forEach(([tierId, tier], i) => {
    const items = sponsorsByTier[tierId]
    if (items && items.length) {
      data.push(`<text text-anchor="middle" x="${(WIDTH / 2) | 0}" y="${y + 42}">${he.encode(tier.name)}</text>`)
      y += 72
      y = layoutItems(items, data, y)
    }
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${y + 20}">\n${data.join('')}</svg>`
}

function buildContributorsSVG(contributors) {
  const data = []
  data.push('<style>a { cursor: pointer; } a circle { pointer-events: none; }</style>\n')
  data.push(`<defs><clipPath id="circle"><circle cx="16" cy="16" r="15.5" /></clipPath></defs>\n`)
  let y = layoutItems(contributors, data, 6)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${y}">\n${data.join('')}</svg>`
}
