<template>
  <div>
    <span :id="currentTipID" class="d-inline-block" tabindex="0">
      <b-btn
        :disabled="isDisabled"
        @click="save(saveData.stepUpdateTxt)"
        variant="outline-secondary--darken3"
        class="px-5"
      >
        Save
      </b-btn>
      <b-tooltip :target="saveData.tooltipTargetID" placement="left" variant="secondary">
        complete step to save
      </b-tooltip>
    </span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Locations from '~/mixins/locations'
import Alert from '~/mixins/alert'
export default {
  mixins: [Locations, Alert],
  props: {
    isDisabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    saveData: {
      type: Object,
      default() {
        return {}
      }
    },
    tooltipID: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    currentTipID() { return this.tooltipID }
  },
  methods: {
    ...mapMutations({
      updateLocProp: 'selectedLocation/UPDATE_PROP'
    }),
    save(key) {
      this.onSave() // in Locations Mixin
      this.updateLocProp({ key, val: true })
      this.updateLocationStatus() // in Locations Mixin
      this.showAlert('Saved', 'success') // in Alert Mixin
    }
  }

}
</script>

<style>

</style>
