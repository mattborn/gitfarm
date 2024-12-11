const fs = require('fs')
const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function reviewFolder(folder) {
  const isRepo = fs.existsSync(`${folder}/.git`)

  if (isRepo) {
    const commit = execSync('git log -1 --oneline', { cwd: folder }).toString().trim()
    console.log(`${folder}: ${commit}`)
    return
  }

  const answer = await new Promise(resolve => {
    rl.question(`Initialize/commit ${folder}? (y/n) `, resolve)
  })

  if (answer.toLowerCase() === 'y') {
    execSync('git init && git add . && git commit -m "Getting started 🎉"', { cwd: folder })
    const commit = execSync('git log -1 --oneline', { cwd: folder }).toString().trim()
    console.log(`${folder}: ${commit}`)
  }
}

async function main() {
  const folders = fs.readdirSync('.').filter(f => fs.statSync(f).isDirectory())
  for (const folder of folders) await reviewFolder(folder)
  rl.close()
}

main().catch(console.error)
