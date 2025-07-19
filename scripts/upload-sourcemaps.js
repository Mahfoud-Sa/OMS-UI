const { execSync } = require('child_process')
const pkg = require('../package.json')

const release = `${pkg.version}`

console.log(`Uploading Sentry sourcemaps for release: ${release}`)

// execSync(`sentry-cli releases new ${release}`, { stdio: 'inherit' })
execSync(
  `sentry-cli sourcemaps inject --org herfa --project electron ./out && sentry-cli sourcemaps upload --org herfa --project electron ./out --release ${release}`,
  {
    stdio: 'inherit'
  }
)

// execSync(`sentry-cli releases finalize ${release}`, { stdio: 'inherit' })
