export const state = () => ({
  location: null,
  redirectCounter: 0
})
export const getters = {
  stepOneData: (state) => {
    let val = null
    if (state.location) {
      val = {
        name: state.location.name,
        recommended_name: state.location.properties.recommended_name,
        street_address_1: state.location.properties.street_address_1,
        city: state.location.properties.city,
        state: state.location.properties.state,
        postal_code: state.location.properties.postal_code,
        country: state.location.properties.country,
        population: state.location.properties.population,
        uspsvalid: state.location.properties.uspsvalid,
        floor_plans: state.location.properties.floor_plans,
        property_feature_1: state.location.properties.property_feature_1,
        naked_domain: state.location.properties.naked_domain,
        custom_slug: state.location.properties.custom_slug
      }
    }
    return val
  },
  stepTwoData: (state) => {
    let val = null
    if (state.location) {
      val = {
        neighborhood: state.location.properties.neighborhood,
        neighborhood_2: state.location.properties.neighborhood_2,
        landmark_1_name: state.location.properties.landmark_1_name,
        apartment_amenity_1: state.location.properties.apartment_amenity_1,
        apartment_amenity_2: state.location.properties.apartment_amenity_2,
        apartment_amenity_3: state.location.properties.apartment_amenity_3,
        community_amenity_1: state.location.properties.community_amenity_1,
        community_amenity_2: state.location.properties.community_amenity_2,
        community_amenity_3: state.location.properties.community_amenity_3,
        neighborhood_keywords: state.location.properties.neighborhood_keywords,
        landmark_keywords: state.location.properties.landmark_keywords,
        additional_apartment_amenities: state.location.properties.additional_apartment_amenities,
        additional_community_amenities: state.location.properties.additional_community_amenities,
        api_neighborhood_keywords: state.location.properties.api_neighborhood_keywords,
        api_landmark_keywords: state.location.properties.api_landmark_keywords,
        negative_keywords: state.location.properties.negative_keywords
      }
    }
    return val
  },
  stepThreeData: (state) => {
    let val = null
    if (state.location) {
      val = {
        redirecttext: state.location.properties.redirecttext,
        redirectstrat: state.location.properties.redirectstrat,
        redirects: state.location.properties.redirects
      }
    }
    return val
  }
}
export const actions = {}

export const mutations = {
  UPDATE_PROP(state, { key, val }) {
    key === 'name'
      ? state.location[key] = val
      : state.location.properties[key] = val
  },
  SET(state, val) {
    state.location = val
  },
  SET_COUNTER(state, val) {
    state.redirectCounter = val
  },
  SET_PROPERTY(state, { key, val }) {
    state.location.properties[key] = val
  },
  SET_KEYWORD_LIST(state, { key, val }) {
    state.location.properties[key] = val
  },
  DELETE_KEYWORD(state, { key, index }) {
    state.location.properties[key].splice(index, 1)
  },
  UPDATE_KEYWORD(state, { key, index, data }) {
    state.location.properties[key][index].name = data
  },
  ADD_KEYWORD(state, { data, key }) {
    state.location.properties[key].push(data)
  },
  UPDATE_KEYWORD_LIST(state, { key, val }) {
    state.location.properties[key] = val
  },
  SET_SELECTED(state, { val }) {
    state.location.properties.redirects.selected = val
  },
  ADD_REDIRECTS(state, val) {
    state.location.properties.redirects.items.push(...val)
  },
  UPDATE_REDIRECT_PROPERTY(state, { key, index }) {
    state.location.properties.redirects.items[index][key] = index
  },
  UPDATE_CELL(state, { val, index, col }) {
    state.location.properties.redirects.items[index][col] = val
  },
  DELETE_REDIRECTS(state) {
    const redirects = state.location.properties.redirects
    redirects.selected.forEach((selection) => {
      const url = selection.current_url
      redirects.items = redirects.items.filter(item => item.current_url !== url)
    })
    redirects.selected = []
  },
  TOGGLE_WILDCARD(state) {
    const redirects = state.location.properties.redirects
    redirects.selected.forEach((selection) => {
      if (selection.strategy === 'Same Domain') {
        const url = selection.formatted_url
        const rowIndex = redirects.items.findIndex(item => item.formatted_url === url)
        url[url.length - 1] === '$'
          ? redirects.items[rowIndex].formatted_url = url.slice(0, -1)
          : redirects.items[rowIndex].formatted_url = `${url}$`
      }
    })
  }
}
