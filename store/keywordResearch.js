export const state = () => ({
  neighborhood: {
    inputs: ['neighborhood', 'neighborhood_2'],
    keywords: ['neighborhood_keywords', 'api_neighborhood_keywords'],
    phrases: ['neighborhood_phrases']
  },
  landmark: {
    inputs: ['landmark_1_name'],
    keywords: ['landmark_keywords', 'api_landmark_keywords'],
    phrases: ['landmark_phrases']
  },
  amenity: {
    inputs: [
      'apartment_amenity_1',
      'apartment_amenity_2',
      'apartment_amenity_3',
      'community_amenity_1',
      'community_amenity_2',
      'community_amenity_3'
    ],
    keywords: [
      'additional_amenities_apartment',
      'additional_amenities_community'
    ],
    phrases: ['amenity_phrases']
  },
  keywordInput: {
    neighborhood_keywords: '',
    landmark_keywords: '',
    additional_amenities_apartment: '',
    additional_amenities_community: '',
    api_neighborhood_keywords: '',
    api_landmark_keywords: ''
  },
  text: '',
  saveData: {
    tooltipTargetID: 'step-two-tip',
    stepUpdateTxt: 'stepTwoComplete'
  },
  loading: false,
  saveTxt: 'Save',
  mfRequiredFields: [
    'landmark_1_name',
    'apartment_amenity_1',
    'community_amenity_1'
  ],
  selected: 'neighborhood',
  options: [
    { text: 'Neighborhood', value: 'neighborhood' },
    { text: 'Landmark', value: 'landmark' },
    { text: 'Amenity', value: 'amenity' }
  ]
})

export const actions = {}

export const mutations = {
  SET(state, obj) {
    const keys = Object.keys(obj)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = obj[key])
  },
  SET_KEYWORD_INPUT(state, { key, val }) {
    state.keywordInput[key] = val
  }
}
