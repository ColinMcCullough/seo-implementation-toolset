/* eslint-disable camelcase */
module.exports = {
  up: async (models) => {
    const transaction = await models.sequelize.transaction()
    try {
      const locations = await models.location.findAll()
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i]
        const { additional_apartment_amenities, additional_community_amenities } = location.properties
        if (additional_apartment_amenities) {
          await location.set({
            'properties.additional_amenities_apartment': additional_apartment_amenities
          })
        }
        if (additional_community_amenities) {
          await location.set({
            'properties.additional_amenities_community': additional_community_amenities
          })
        }
        await location.save({ transaction })
      }
      await transaction.commit()
      console.log('completed new amenity keys migrations')
    } catch (err) {
      transaction.rollback()
    }
  }
}
