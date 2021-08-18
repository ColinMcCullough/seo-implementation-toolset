require('dotenv').config()
const migration = require('../server/config/migration')

async function run () {
  await migration.up()
}

run()
