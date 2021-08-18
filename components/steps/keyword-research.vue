<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-form-group label="Complete Keyword Research Below">
          <b-form-radio-group
            id="btn-radios-2"
            v-model="selected"
            :options="radioOptions"
            buttons
            button-variant="outline-primary"
            size="md"
            name="radio-btn-outline"
            class="w-75"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-card class="py-0 mb-2 ">
      <b-row class="align-items-center">
        <b-col cols="12" lg="12" xl="6">
          <h5 class="text-left mb-0">
            <strong>Negative Keywords:</strong>
            <span style="color: #dc3545">{{ compform.negative_keywords ? compform.negative_keywords : 'N/A' }}</span>
          </h5>
        </b-col>
        <b-col class="text-right pr-1 pl-2" cols="12" lg="4" xl="3">
          <span :id="disabledKeywordsToolTip" class="block" tabindex="0" block>
            <b-btn
              @click="getKeywords()"
              :disabled="disabledGetKeywords"
              variant="secondary"
              class="mb-1"
              block
            >
              <div class="d-flex justify-content-center">
                Get Keywords
                <b-spinner v-if="keywordStore.loading" class="mt-1 ml-1" small label="Loading..." />
              </div>
            </b-btn>
            <b-tooltip target="get-keywords" variant="secondary" placement="topleft">
              missing address fields
            </b-tooltip>
          </span>
        </b-col>
        <b-col class="text-right pr-2 pl-1" cols="12" lg="4" xl="3">
          <b-btn
            @click="getPhrases"
            variant="secondary"
            class="mb-1"
            block
          >
            Get Phrases
          </b-btn>
        </b-col>
      </b-row>
      <!-- Keyword Section -->
      <b-row>
        <b-col
          v-for="(input, index) in getInputs"
          :key="`${input}-${index}`"
          :class="numInputCol"
        >
          <label :for="input">
            {{ `${input.replace(/_/g,' ').replace('apartment','apt').toUpperCase()}` }}
          </label>
          <b-container :style="getStateStyle(input)" class="p-1 mr-0 ml-0 keywords">
            <drag
              :listName="input"
              :groupObj="{ name: input, pull: 'clone', put: true }"
              :needsChangeEvnt="true"
              :stepComplete="!disabledSave"
            />
          </b-container>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-for="keyword in getKeywordInputs"
          :key="keyword"
          class="col-12 col-lg col-xl"
        >
          <div class="form-inline">
            <label :for="`textarea-${keyword}`">
              {{ `${keyword.replace(/_/g,' ').toUpperCase()}` }}
              <b-button
                @click="addKeyword(keyword)"
                size="sm"
                variant="secondary"
                class="mx-1"
                style="padding: 0rem 0.15rem; margin-bottom: 4px;"
              >
                <b-icon icon="plus" />
              </b-button>
              <b-form-input
                :value="keywordStore.keywordInput[keyword]"
                @input="setKeywordInput({ key: keyword, val: $event })"
                size="sm"
                style="height: 1.7em; margin-bottom: 4px;"
                placeholder="add keywords here"
              />
            </label>
          </div>
          <b-container class="p-2 mr-0 ml-0 keywords keywords-container">
            <drag
              :listName="keyword"
              :groupObj="{ name: keyword, pull: 'clone', put: false }"
              :needsChangeEvnt="false"
              :stepComplete="!disabledSave"
            />
          </b-container>
        </b-col>
      </b-row>
      <!-- Phrases Section -->
      <b-row>
        <b-col
          v-for="phrase in getPhraseInputs"
          :key="phrase"
          class="col-12 col-md"
        >
          <b-form-group
            class="pb-0 mb-0 text-left text-uppercase"
          >
            <label :for="`textarea-${phrase}`">
              {{ `${phrase.replace(/_/g,' ').toUpperCase()}` }}
              <b-button @click="copyPhrases(phrase)" class="p-0 m-0" variant="light">
                <b-img
                  src="/copy-icon.png"
                  width="20"
                  height="20"
                  class="jello-vertical"
                />
              </b-button>
              <span style="font-weight:normal;">
                {{ keywordStore.text }}
              </span>
            </label>
            <b-form-textarea
              :id="`textarea-${phrase}`"
              :placeholder="`${phrase.replace(/_/g,' ')} will populate after running generate phrases`"
              :value="location.properties[phrase]"
              @input="onInput(phrase, $event)"
              rows="4"
              class="text-left"
              required
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
    <b-row class="align-items-center">
      <b-col class="text-right py-0">
        <save-step
          :isDisabled="disabledSave"
          :saveData="keywordStore.saveData"
          :tooltipID="displaySaveTip"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import SaveStep from '~/components/save-step'
import Drag from '~/components/drag'
import Locations from '~/mixins/locations'
import PhraseGenerator from '~/mixins/phrases'
import Diacritics from '~/mixins/diacritics'
import Alert from '~/mixins/alert'
export default {
  components: {
    SaveStep,
    Drag
  },
  mixins: [PhraseGenerator, Diacritics, Alert, Locations],
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      keywordStore: state => state.keywordResearch,
      locations: state => state.locations.locations,
      location: state => state.selectedLocation.location,
      initSelects: state => state.initSelects
    }),
    ...mapGetters({
      compform: 'selectedLocation/stepTwoData'
    }),
    selected: {
      get() { return this.$store.state.keywordResearch.selected },
      set(val) { this.$store.commit('keywordResearch/SET', { 'selected': val }) }
    },
    getInputs() {
      return this.keywordStore[this.selected].inputs
    },
    numInputCol() {
      return this.keywordStore[this.selected].inputs.length === 6
        ? 'col-12 col-md-4' : 'col-12 col-md'
    },
    getKeywordInputs() {
      return this.keywordStore[this.selected].keywords
    },
    getPhraseInputs() {
      return this.keywordStore[this.selected].phrases
    },
    radioOptions() {
      return this.initSelects.selects[0].value === 'mf'
        ? this.keywordStore.options
        : this.keywordStore.options.slice(0, -1)
    },
    disabledGetKeywords() {
      return !this.validApiProps()
    },
    displaySaveTip() {
      return !this.validateStepTwo() ? 'step-two-tip' : 'not-disabled'
    },
    disabledKeywordsToolTip() {
      return !this.validApiProps() ? 'get-keywords' : 'not-disabled'
    },
    disabledSave() {
      const valid = this.validateStepTwo()
      return !valid
    }
  },
  methods: {
    ...mapMutations({
      setProperty: 'keywordResearch/SET',
      setKeywordInput: 'keywordResearch/SET_KEYWORD_INPUT',
      moveKeyword: 'selectedLocation/SET_PROPERTY',
      deleteKeyword: 'selectedLocation/DELETE_KEYWORD',
      updateKeyword: 'selectedLocation/UPDATE_KEYWORD',
      addKywrd: 'selectedLocation/ADD_KEYWORD'
    }),
    addKeyword(property) {
      const value = this.keywordStore.keywordInput[property] // value user typed in
      const keywords = this.locations[this.locIdx].properties[property]
      const largestId = keywords.length > 0
        ? Math.max.apply(Math, keywords.map(function(o) { return o.id }))
        : 0
      const data = { name: value, id: largestId + 1 }
      this.addKywrd({ data, key: property }) // updates location state
      this.setKeywordInput({ key: property, val: '' }) // updates input state
    },
    copyPhrases(id) {
      this.$copyText(this.location.properties[id])
      this.setProperty({ 'text': 'Copied!' })
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.setProperty({ 'text': '' }), 3000)
    },
    getFields() {
      return this.initSelects.selects[0].value === 'mf'
        ? this.keywordStore.mfRequiredFields
        : []
    },
    getApiProps() {
      return {
        vertical: this.initSelects.selects[0].value,
        address: this.location.properties.street_address_1,
        class: this.location.properties.class,
        city: this.location.properties.city,
        state: this.location.properties.state,
        zip: this.location.properties.postal_code
      }
    },
    validApiProps() {
      let val = true
      const obj = this.getApiProps()
      delete obj.class
      for (const key in obj) {
        if (!obj[key]) {
          val = false
          break
        }
      }
      return val
    },
    getStateStyle(field) {
      let style = 'border: 1px solid #ced4da; height:42px; border-radius: 0.25rem'
      const reqFields = this.getFields()
      if (reqFields.includes(field)) {
        const val = this.location.properties[field]
        if (val === '' || val === null || val.length === 0) {
          style = 'border: 1px solid #e94f3d; height:42px; border-radius: 0.25rem'
        } else {
          style = 'border: 1px solid #28a745; height:42px; border-radius: 0.25rem'
        }
      }
      return style
    },
    validateField(field) {
      let valid = true
      const reqFields = this.getFields()
      if (reqFields.includes(field)) {
        const val = this.location.properties[field]
        if (val === '' || val === null || val.length === 0) {
          valid = false
        }
      }
      return valid
    },
    validateStepTwo() {
      let valid = true
      const reqFields = this.getFields()
      for (const index in reqFields) {
        const field = this.compform[reqFields[index]]
        if (field === '' || field === null || field.length === 0) {
          valid = false
          break
        }
      }
      return valid
    },
    makeObject(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = { name: arr[i], id: i }
      }
      return arr
    },
    getKeywords() {
      const props = this.getApiProps()
      this.setProperty({ 'loading': true })
      const neighborhoodKeywords = []
      const landmarkKeywords = []
      this.$axios.$put('/placesapi/placesRequest', { props })
        .then((res) => {
          const { type1, type2 } = res
          for (const type in type1) {
            type1[type].forEach(place => neighborhoodKeywords.push(this.formatName(place)))
          }
          for (const type in type2) {
            type2[type].forEach(place => landmarkKeywords.push(this.formatName(place)))
          }
          this.onUpdate({ key: 'api_neighborhood_keywords', val: this.makeObject(neighborhoodKeywords) })
          this.onUpdate({ key: 'api_landmark_keywords', val: this.makeObject(landmarkKeywords) })
          this.setProperty({ 'loading': false })
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err)
          this.showAlert('Get Keywords Failed. Check the address for this location', 'danger')
          this.setProperty({ 'loading': false })
        })
    },
    onInput(key, val) {
      this.onUpdate({ key, val })
    },
    splitMapFilterTrim(data1, data2) {
      return data1.concat(data2)
        .map(item => item.name.trim())
        .filter(item => item)
    },
    getKeywordsObj() {
      // eslint-disable-next-line camelcase
      const { api_neighborhood_keywords, neighborhood_keywords, api_landmark_keywords, landmark_keywords } = this.location.properties
      return {
        neighborhood_phrases: this.splitMapFilterTrim(api_neighborhood_keywords, neighborhood_keywords),
        landmark_phrases: this.splitMapFilterTrim(api_landmark_keywords, landmark_keywords),
        amenity_phrases: this.initSelects.selects[0].value === 'mf'
          ? this.compform.additional_apartment_amenities
            .concat(this.compform.additional_community_amenities)
            .map(item => item.name.trim()).filter(item => item)
          : []
      }
    },
    getPhrases() {
      const keywords = this.getKeywordsObj()
      const keyVal = Object.entries(keywords)
      const phrases = { neighborhood_phrases: [], landmark_phrases: [], amenity_phrases: [] }
      for (const [key, arr] of keyVal) {
        arr.forEach((keyword) => {
          phrases[key].push(this.getPhrase(key, keyword))
        })
      }
      if (this.initSelects.selects[0].value !== 'mf') delete phrases.amenity_phrases
      const phraseKeyVal = Object.entries(phrases)
      for (const [prop, phrase] of phraseKeyVal) {
        this.onUpdate({ key: prop, val: phrase.toString().replace(/\s\s+/g, ' ').trim() })
      }
    },
    formatName(name) {
      return this.removeDiacritics(name)
        .replace(/[^0-9a-zA-Z']+|\s+|']|Helipad 1|Helipad 2|Helipad|Heliport/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }
  }
}
</script>

<style>
@media only screen and (min-width: 1200px) {
  .container {
    max-width: 2500px;
  }
}
.keywords-container {
  border: 1.5px solid #ccc;
  width: 100%;
  height: 250px;
  overflow-y: scroll;
  scroll-behavior: smooth
}
.keywords .form-control:focus {
  box-shadow: none;
}
.pillz  {
    color: black;
    background:var(--quaternary);
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: default;
    float: left;
    padding: 4px 8px;
    min-width: 70px;
    min-height: 32px;
}
.pill-box  {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    line-height: 1.42857143;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
