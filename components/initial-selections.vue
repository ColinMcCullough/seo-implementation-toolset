<template>
  <b-container fluid>
    <instructions />
    <dropdowns v-if="initSelects.toggle.selected === 'upload'" />
    <b-collapse id="collapse-1" v-model="visible">
      <b-row>
        <b-col
          v-if="initSelects.toggle.selected === 'upload'"
          cols="12"
          md="3"
        >
          <loadfile />
        </b-col>
        <b-col
          v-if="initSelects.toggle.selected !== 'upload'"
          md="4"
          cols="12"
        >
          <findLocation />
        </b-col>
        <b-col :md="getColWidth()" cols="12">
          <lpinput />
        </b-col>
        <b-col
          v-if="initSelects.toggle.selected === 'upload'"
          :md="getColWidth()"
          cols="12"
        >
          <phaseInput />
        </b-col>
        <b-col :md="getColWidth()" cols="12">
          <loadbtn />
        </b-col>
      </b-row>
    </b-collapse>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import lpinput from '~/components/init-selections/lpinput'
import loadbtn from '~/components/init-selections/loadbtn'
import dropdowns from '~/components/init-selections/dropdowns'
import loadfile from '~/components/init-selections/loadfile'
import phaseInput from '~/components/init-selections/phaseInput'
import instructions from '~/components/init-selections/instructions'
import findLocation from '~/components/init-selections/findLocation'
export default {
  components: {
    lpinput,
    loadbtn,
    dropdowns,
    loadfile,
    phaseInput,
    instructions,
    findLocation
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      initSelects: state => state.initSelects
    }),
    visible: {
      get() { return this.$store.state.initSelects.visible },
      set(val) { this.$store.commit('initSelects/SET', { 'visible': val }) }
    }
  },
  methods: {
    getColWidth() {
      return this.initSelects.toggle.selected === 'upload' ? 3 : 4
    }
  }
}
</script>

<style>
  .alert-dismissible .close {
      padding: .9rem 1.15rem;
  }
</style>
