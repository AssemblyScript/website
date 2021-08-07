const fs = require('fs')
const fetch = require('node-fetch')
const tiers = require('../data/tiers.json')

/** Repositories where commits are being considered as contributions. */
const repos = [
  "AssemblyScript/assemblyscript",
  "AssemblyScript/examples",
  "AssemblyScript/website"
]

/** Excluded GitHub user names (of bots). */
const githubExcludes = [
  "dependabot[bot]",
  "jsdelivrbot"
]

/** Inherited OSC user names (of duplicate accounts). */
const sponsorInherits = {
  "nearprotocol": [ "nearprotocol1" ]
}

/** Excluded OSC user names (of defunct accounts). */
const sponsorExcludes = []

const defaultLogoSize = 32

/** Computes the size of a sponsor logo times two in case of higher pixel densities. */
function getLogoSize(item) {
  const totalAmountDonated = item.totalAmountDonated
  if (typeof totalAmountDonated === 'number') {
    for (const tier of Object.values(tiers)) {
      if (totalAmountDonated >= tier.minAmount) {
        return 2 * tier.size
      }
    }
  }
  return 2 * defaultLogoSize
}

/** Updates sponsors data, also substituting custom-made logos. */
function updateSponsors() {
  const files = fs.readdirSync(__dirname + '/../src/.vuepress/public/sponsors')
  const logos = {}
  files.forEach(file => {
    if (/\.(svg|png)$/.test(file)) {
      const id = file.substring(0, file.lastIndexOf('.'))
      logos[id] = 'sponsors/' + file
    }
  })
  fetch('https://opencollective.com/assemblyscript/members/all.json')
    .then(res => res.json())
    .then(json => {
      const seen = new Map()
      const sponsors = json
        .map(item => {
          item.username = item.profile.substring(item.profile.lastIndexOf('/') + 1)
          return item
        })
        .filter(item => {
          if (seen.has(item.username)) return false
          seen.set(item.username, item.totalAmountDonated)
          return item.isActive && item.totalAmountDonated > 0
        })
        .map(item => {
          const inherits = sponsorInherits[item.username]
          if (Array.isArray(inherits)) {
            for (let othername of inherits) {
              json
                .filter(otheritem => otheritem.username == othername)
                .forEach(otheritem => item.totalAmountDonated += otheritem.totalAmountDonated)
              seen.delete(othername)
            }
          }
          return item
        })
        .filter(item => !sponsorExcludes.includes(item.username) && seen.has(item.username))
        .sort((a, b) => b.totalAmountDonated - a.totalAmountDonated)
        .map(item => {
          const logoSize = getLogoSize(item)
          const logo = logos[item.username] || 'https://images.opencollective.com/' + item.username + '/avatar/' + logoSize + '.jpg'
          const link = item.totalAmountDonated >= tiers.bronze.minAmount
            ? item.website || item.profile
            : item.profile
          return {
            // id: item.MemberId,
            name: item.name,
            logo: logo,
            link: link,
            amount: item.totalAmountDonated
          }
        })
      fs.writeFileSync(__dirname + '/../data/sponsors.json', JSON.stringify(sponsors, null, 2))
    })
    .catch(err => {
      console.error(err.stack)
      process.exit(1)
    })
}

/** Updates contributors data by pulling stats from GitHub. */
function updateContributors() {
  const contributors = {}
  Promise.all(repos.map(repo => fetch('http://api.github.com/repos/' + repo + '/contributors').then(res => res.json())))
    .then(jsons => {
      jsons.forEach(json => {
        json
          .filter(item => !githubExcludes.includes(item.login))
          .forEach(item => {
            const contributor = contributors[item.id]
            if (contributor) {
              contributor.count += item.contributions
            } else {
              contributors[item.id] = {
                // id: item.id,
                name: item.login,
                logo: item.avatar_url + '&s=' + getLogoSize(item),
                link: item.html_url,
                count: item.contributions
              }
            }
          })
      })
      const sortedContributors = Object.values(contributors).sort((a, b) => b.count - a.count)
      fs.writeFileSync(__dirname + '/../data/contributors.json', JSON.stringify(sortedContributors, null, 2))
    })
    .catch(err => {
      console.error(err.stack)
      process.exit(1)
    })
}

updateSponsors()
updateContributors()
