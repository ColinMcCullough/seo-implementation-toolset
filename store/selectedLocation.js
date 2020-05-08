export const state = () => ({
  location: null
})
export const getters = {
  getProperties: (state) => {
    return state.location
      ? state.location.properties
      : null
  },
  getLocationID: (state) => {
    return state.location ? state.location.id : null
  },
  formFields(state) {
    let val = null
    if (state.location) {
      val = {
        name: state.location.name,
        recommendedname: state.location.properties.recommendedname,
        street_address_1: state.location.properties.street_address_1,
        city: state.location.properties.city,
        state: state.location.properties.state,
        postal_code: state.location.properties.postal_code,
        country: state.location.properties.country,
        population: state.location.properties.population,
        uspsvalid: state.location.properties.uspsvalid,
        floor_plans: state.location.properties.floor_plans,
        property_feature_1: state.location.properties.property_feature_1,
        custom_slug: state.location.properties.custom_slug
      }
    }
    return val
  }
}
export const actions = {}
export const mutations = {
  SET(state, val) {
    state.location = val
  }
}
