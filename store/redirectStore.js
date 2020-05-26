export const state = () => ({
  options: [
    { value: null, text: 'Select Strategy' },
    { value: 'Same Domain', text: 'Same Domain' },
    { value: 'Cross Domain', text: 'Cross Domain' },
    { value: 'Secure Cross Domain', text: 'Secure Cross Domain' },
    { value: 'Secure Naked Same Domain', text: 'Secure Naked Same Domain' },
    { value: 'No Redirects', text: 'No Redirects' }
  ],
  saveData: {
    tooltipTargetID: 'step-three-tip',
    stepUpdateTxt: 'stepThreeComplete'
  }
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
