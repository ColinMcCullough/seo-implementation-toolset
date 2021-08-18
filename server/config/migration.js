const path = require('path')
const Umzug = require('umzug')
const models = require('../models')
const umzug = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, '../migrations'),
    // inject sequelize's QueryInterface in the migrations
    params: [models]
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: 'sequelize',
  storageOptions: {
    sequelize: models.sequelize
  }
})
module.exports = umzug
