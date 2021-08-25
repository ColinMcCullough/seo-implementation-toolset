import Papa from 'papaparse'
import { mapState, mapMutations } from 'vuex'
import Alert from '~/mixins/alert'

export default {
  mixins: [Alert],
  data () {
    return {
      defaultService: {
        mf: 'elite',
        ss: 'elite',
        sl: 'enterprise'
      },
      splitRgx: /\s*(?:,|$)\s*/, // staying here
      // staying here
      propertiesToArr: [
        'neighborhood_keywords',
        'landmark_keywords',
        'additional_amenities_apartment',
        'additional_amenities_community',
        'neighborhood',
        'neighborhood_2',
        'landmark_1_name',
        'apartment_amenity_1',
        'apartment_amenity_2',
        'apartment_amenity_3',
        'community_amenity_1',
        'community_amenity_2',
        'community_amenity_3'
      ]
    }
  },
  computed: {
    ...mapState({
      addImportProps: state => state.addImportProps,
      initSelects: state => state.initSelects,
      toggle: state => state.initSelects.toggle
    }),
    disabledUpload() {
      let valid
      if (this.toggle.selected === 'upload') {
        valid = !this.validateIntitialSelections()
      } else {
        valid = !(this.validateLPID())
      }
      return valid
    },
    uploadTip() {
      let val = 'not-disabled'
      if ((this.toggle.selected === 'upload' && !this.validateIntitialSelections()) || (this.toggle.selected === 'import' && !this.validateLPID())) {
        val = 'upload-tip'
      }
      return val
    }
  },
  methods: {
    ...mapMutations({
      setSelects: 'initSelects/SET',
      addLocations: 'locations/ADD',
      updateLocationTbl: 'locationsTable/SET_MAP_ITEMS'
    }),
    validateIntitialSelections() {
      const values = [this.initSelects.lpId]
      this.initSelects.selects.forEach(select => values.push(select.value))
      let valid = true
      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
          valid = false
          break
        }
      }
      return (valid && this.initSelects.file && this.initSelects.lpId && this.initSelects.phase)
    },
    validateLPID() {
      return this.initSelects.lpId
    },
    async postToDB(locations) {
      await this.$axios.$post('api/locations', {
        lpId: this.initSelects.lpId,
        locations
      })
      await this.$axios.$post('api/lp-project', {
        lpId: this.initSelects.lpId,
        selects: this.initSelects.selects
      })
    },
    async loadLocations(locations) {
      const res = await this.$axios.$post('api/locations', {
        lpId: this.initSelects.lpId,
        locations
      })
      this.addLocations(res)
      this.updateLocationTbl(res)
      this.setSelects({ 'loading': false })
      this.showAlert(this.alertProps.csvSuccessMsg, 'success')
      this.setSelects({ 'file': null })
    },
    async processUpload() {
      this.setSelects({ 'loading': true })
      const data = await this.parseCSV(this.initSelects.file)
      const locations = await this.getLocationData(data)
      if (locations.length && !this.onProjectPage) { // on home page
        await this.postToDB(locations)
        window.open(`/lp-project/${this.initSelects.lpId}`, '_self')
        this.setSelects({ 'loading': false })
      } else if (locations.length && this.onProjectPage) { // on project page
        this.loadLocations(locations)
      } else {
        this.showAlert(this.alertProps.csvErrMsg, 'danger') // err
        this.setSelects({ 'loading': false })
      }
    },
    async upload() {
      try {
        if (!this.onProjectPage) { // on home page
          const lpId = this.initSelects.lpId
          const dbResult = await this.$axios.$get(`api/locations/${lpId}`)
          !dbResult.length // no existing project found in db
            ? this.processUpload()
            : this.showAlert(this.alertProps.existingLPMsg, 'danger')
        } else { // on Project Page
          this.processUpload()
        }
      } catch (err) {
        this.showAlert(this.alertProps.csvErrMsg, 'danger')
        this.setSelects({ 'loading': false })
      }
    },
    reject(obj, keys) {
      const vkeys = Object.keys(obj)
        .filter(k => !keys.includes(k))
      return this.pick(obj, vkeys)
    },
    pick(obj, keys) {
      return keys.map(k => k in obj ? { [k]: obj[k] } : {})
        .reduce((res, o) => Object.assign(res, o), {})
    },
    parseCSV(file) {
      return new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve(results.data)
          }
        })
      })
    },
    buildLandmarks(props, vertical) {
      const map = {
        mf: ['landmark_1_name', 'nearby_employer_1', 'nearby_employer_2', 'nearby_employer_3', 'nearby_employers', 'nearby_schools', 'nearby_restaurants', 'nearby_shopping'],
        ss: ['landmark_1_name', 'nearby_roadway_1', 'nearby_roadway_2'],
        sl: ['landmark_1_name', 'nearby_restaurants', 'nearby_shopping', 'nearby_healthcare_1']
      }
      return map[vertical].reduce((res, key) => {
        const val = props[key] && typeof props[key] === 'string'
          ? props[key].split(this.splitRgx) : []
        res.push(...val)
        return res
      }, [])
    },
    getLocationData(data) {
      return data[0].name ? data.map((location) => {
        const { name } = location
        const properties = this.reject(location, ['name'])
        const addPropertyFields = this.addImportProps
        // checks for service level
        properties.service_level = properties.service_level
          ? properties.service_level.toLowerCase()
          : this.defaultService[this.initSelects.selects[0].value]
        // adds phase property to each location
        properties.phase = this.initSelects.phase
        // adds additional property fields
        for (const prop in addPropertyFields) {
          properties[prop] = addPropertyFields[prop]
        } // turns keyword string into arr objects
        this.propertiesToArr.forEach((prop) => {
          const arr = properties[prop]
            ? properties[prop].split(this.splitRgx)
            : prop === 'landmark_keywords'
              ? this.buildLandmarks(properties, this.initSelects.selects[0].value)
              : []
          for (let i = 0; i < arr.length; i++) {
            arr[i] = { name: arr[i], id: i }
          }
          properties[prop] = arr
        })
        return { name, properties }
      }).filter(location => location.name) : []
    }
  }
}
