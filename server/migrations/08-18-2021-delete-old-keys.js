const keys = "'amenity_keywords' - 'comm_amenity_keywords'"
module.exports = {
  // adds properties vimeo_username, foursquare_username, tumblr_username, payment_type, business_owner_name,
  // and business_open_date locations table properties column with default values shown below
  up: async (models) => {
    await models.sequelize.query(
      `UPDATE locations
      SET properties = properties - ${keys}`
    )
    console.log('completed delete amenity keys migrations')
  },
  down: async (models) => {
  }
}
