const fs = require('fs')
const fetch = require('node-fetch')
const sharp = require('sharp')
const pngquant = require('pngquant')

const contributors = require('../data/contributors.json')
const sponsors = require('../data/sponsors.json')
const tiers = require('../data/tiers.json')

// Width of the resulting images
const WIDTH = 680

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
    return 2 + height - 32
  }

  function row(items) {
    for (let item of items) {
      const image = item.image
      let clipPath = ''
      if (image.width == 32 && image.height == 32) {
        clipPath = ` clip-path="url('#circle')"`
      }
      data.push(`<a transform="translate(${x},${y})" xlink:href="${item.link}"${clipPath}><title>${item.name}</title><image width="${image.width}" height="${image.height}" xlink:href="data:image/png;base64,${image.data.toString('base64')}" /></a>\n`)
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
        const newW = w + image.width + (w > 0 ? margin(image.height) : 0)
        if (newW > WIDTH) break
        rowItems.push(item)
        w = newW
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
  data.push('<style>a { cursor: pointer; } text { fill: #2c3e50; font-weight: 600; font-size: 21px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; }</style>\n')
  data.push(`<defs><clipPath id="circle"><circle cx="16" cy="16" r="16" /></clipPath></defs>\n`)
  let y = 0
  Object.entries(tiers).forEach(([tierId, tier], i) => {
    const items = sponsorsByTier[tierId]
    if (items && items.length) {
      data.push(`<text text-anchor="middle" x="${(WIDTH / 2) | 0}" y="${y + 32}">${tier.name}</text>`)
      y += 60
      y = layoutItems(items, data, y)
    }
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${y}">\n${data.join('')}</svg>`
}

function buildContributorsSVG(contributors) {
  const data = []
  data.push('<style>a { cursor: pointer; }</style>\n')
  data.push(`<defs><clipPath id="circle"><circle cx="16" cy="16" r="16" /></clipPath></defs>\n`)
  let y = layoutItems(contributors, data, 0)
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${y}">\n${data.join('')}</svg>`
}
