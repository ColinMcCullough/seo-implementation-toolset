/* eslint-disable camelcase */
module.exports = {
  up: async (models) => {
    const transaction = await models.sequelize.transaction()
    try {
      const locations = await models.location.findAll()
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i]
        const { amenity_keywords, comm_amenity_keywords } = location.properties
        if (amenity_keywords) {
          await location.set({
            'properties.additional_apartment_amenities': amenity_keywords
          })
        }
        if (comm_amenity_keywords) {
          await location.set({
            'properties.additional_community_amenities': comm_amenity_keywords
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
