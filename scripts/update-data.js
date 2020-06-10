const fs = require('fs')
const fetch = require('node-fetch')

/** Repositories where commits are being considered as contributions. */
const repos = [
  "AssemblyScript/assemblyscript",
  "AssemblyScript/working-group",
  "AssemblyScript/community-group",
  "AssemblyScript/examples",
  "AssemblyScript/website"
]

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
      const seen = new Set()
      const sponsors = json
        .filter(item => {
          if (seen.has(item.profile)) return false
          seen.add(item.profile)
          return item.isActive && item.totalAmountDonated > 0
        })
        .sort((a, b) => b.totalAmountDonated - a.totalAmountDonated)
        .map(item => {
          const slug = item.profile.substring(item.profile.lastIndexOf('/') + 1)
          const logo = logos[slug] || 'https://images.opencollective.com/' + slug + '/' + item.MemberId + '/logo.png'
          return {
            // id: item.MemberId,
            name: item.name,
            logo: logo,
            link: item.website || item.profile,
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
          .forEach(item => {
            const contributor = contributors[item.id]
            if (contributor) {
              contributor.count += item.contributions
            } else {
              contributors[item.id] = {
                // id: item.id,
                name: item.login,
                logo: item.avatar_url,
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
