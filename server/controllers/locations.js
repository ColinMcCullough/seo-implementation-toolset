const models = require('../models')
module.exports = {
  createLocations,
  updateLocations,
  getLocations,
  getAllLocations,
  deleteLocation
}

async function createLocations (lpId, locations) {
  const returnLocations = []
  for (let i = 0; i < locations.length; i++) {
    const { name, properties } = locations[i]
    // eslint-disable-next-line no-console
    console.log({
      lpId,
      name,
      properties
    })
    const location = await models.location.create({
      lpId,
      name,
      properties
    })
    returnLocations.push(location)
  }
  return returnLocations
}

async function updateLocations (locations) {
  for (let i = 0; i < locations.length; i++) {
    const { id, name, properties } = locations[i]
    await models.location.update({ name, properties }, { where: { id } })
  }
}

function getLocations (lpId) {
  return models.location.findAll({ where: { lpId } })
}

function getAllLocations () {
  return models.location.findAll({ attributes: ['properties', 'lpId', 'name'] })
    .then((res) => {
      return res.map((location) => {
        return {
          internal_branded_name: location.properties.internal_branded_name,
          name: location.name,
          lpId: location.lpId
        }
      })
    })
}

function deleteLocation (id) {
  return models.location.destroy({
    where: { id }
  })
}
