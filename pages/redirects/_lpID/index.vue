<template>
  <div>
    <g5-nav>
      <template v-slot:alert>
        <b-alert
          :show="alertProps.dismissCountDown"
          :variant="alertProps.alertvariant"
          @dismiss-count-down="countDownChanged"
          @dismissed="set({alertMsg: '',alertvariant: '', dismissCountDown: 0})"
          dismissible
          fade
        >
          {{ alertProps.alertMsg }}
        </b-alert>
      </template>
      <template v-slot:content>
        <menu-dropdown />
      </template>
    </g5-nav>
    <div class="main-with-nav">
      <b-container fluid class="scroll-container redirects">
        <h1 class="text-center font-weight-bold mb-0 mt-4">
          Redirects
        </h1>
        <b-row class="px-4">
          <b-col lg="4" class="p-2">
            <b-form-group
              label="Filter"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filterInput"
                  :value="redirects.filter"
                  @input="setRedirectProp({'filter': $event})"
                  type="search"
                  placeholder="Type to Search"
                />
                <b-input-group-append>
                  <b-button
                    :disabled="!redirects.filter"
                    @click="setRedirectProp({'filter': ''})"
                  >
                    Clear
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col lg="4" class="p-2">
            <b-form-group
              label="Filter On *Leave all unchecked to filter on all data"
              label-size="sm"
              class="mb-0 pt-2"
            >
              <b-form-checkbox-group
                :value="redirects.filterOn"
                @input="setRedirectProp({'filterOn': $event})"
                class="mt-1"
              >
                <b-form-checkbox
                  v-for="field in redirects.fields"
                  :key="field.key"
                  :value="field.key"
                >
                  {{ field.label }}
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
          </b-col>
          <b-col lg="4" class="p-2">
            <b-form-group
              label="Sort"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-select
                  id="sortBySelect"
                  v-model="sortBy"
                  :options="sortOptions"
                >
                  <template v-slot:first>
                    <option value="">
                      -- none --
                    </option>
                  </template>
                </b-form-select>
                <b-form-select
                  v-model="sortDesc"
                  :disabled="!redirects.sortBy"
                  size="sm"
                  class="w-25"
                >
                  <option :value="false">
                    Asc
                  </option>
                  <option :value="true">
                    Desc
                  </option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="px-4">
          <b-col lg="3" class="p-2 w-50">
            <b-form-group
              label="Per page"
              label-size="sm"
              label-for="perPageSelect"
              class="mb-0"
            >
              <b-form-select
                id="perPageSelect"
                :value="redirects.perPage"
                @change="setRedirectProp({'perPage': $event})"
                :options="redirects.pageOptions"
                size="sm"
              />
            </b-form-group>
          </b-col>
          <b-col lg="3" class="p-2">
            <b-form-group
              label="Pick Page"
              label-size="sm"
              label-for="paginationComponent"
              class="mb-0"
            >
              <b-pagination
                id="paginationComponent"
                :value="redirects.currentPage"
                @change="setRedirectProp({'currentPage': $event})"
                :total-rows="redirects.totalRows"
                :per-page="redirects.perPage"
                align="fill"
                size="sm"
                class="my-0"
              />
            </b-form-group>
          </b-col>
          <b-col lg="2" class="mt-auto p-2">
            <b-button @click="copyUrls('current_url')" size="sm" class="" block>
              {{ redirects.current_url_btn }}
            </b-button>
          </b-col>
          <b-col lg="2" class="mt-auto p-2">
            <b-button @click="copyUrls('formatted_url')" size="sm" class="" block>
              {{ redirects.formatted_url_btn }}
            </b-button>
          </b-col>
          <b-col lg="2" class="mt-auto p-2">
            <b-button @click="save()" size="sm" class="" block>
              {{ redirects.saveButton }}
            </b-button>
          </b-col>
        </b-row>
        <b-row class="px-4" style="background-color: white">
          <b-col>
            <b-table
              ref="redirectsTable"
              :items="items"
              :fields="redirects.fields"
              :current-page="redirects.currentPage"
              :per-page="redirects.perPage"
              :filter="redirects.filter"
              :filterIncludedFields="redirects.filterOn"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="redirects.sortDirection"
              @filtered="onFiltered"
              class="redirects-tbl"
              sticky-header="42rem"
              responsive="true"
              bordered
              show-empty
              small
              stacked="md"
            >
              <!-- CUSTOM CHECKBOX HEADER -->
              <template v-slot:head(entered)="data">
                <b-form-checkbox
                  id="select-all"
                  :state="selectAll"
                  v-model="selectAll"
                  @input="selectAllChecks($event, data)"
                  name="check-button"
                >
                  {{ data.field.label }}
                </b-form-checkbox>
              </template>
              <!-- CUSTOM CHECKBOX HEADER -->
              <template v-slot:cell(name)="data">
                {{ initSelects.selects[2].value === 'no'
                  ? data.item.name
                  : data.item.internal }}
              </template>
              <template v-slot:cell(current_url)="data">
                <b-link id="strat-link" :href="data.item.current_url" target="_blank">
                  {{ data.item.current_url }}
                </b-link>
              </template>
              <template v-slot:cell(new_url)="data">
                <b-form-input
                  :value="data.value"
                  @input="updateCell($event, data)"
                />
              </template>
              <template v-slot:cell(formatted_url)="data">
                <p />
                {{ data.item.strategy === 'Cross Domain' ? `${data.item.current_url} ${data.item.new_url}` : data.value }}
              </template>
              <template v-slot:cell(entered)="data">
                <b-form-checkbox
                  :id="`${data.item.locId}-${data.item.id}`"
                  :state="data.item.entered ? true : false"
                  :checked="data.item.entered"
                  @input="updateCell($event, data)"
                  name="check-button"
                />
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <g5-footer />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import g5Nav from '~/components/nav'
import menuDropdown from '~/components/menu-dropdown'
import g5Footer from '~/components/footer'
import Alert from '~/mixins/alert'
import Locations from '~/mixins/locations'
import Save from '~/mixins/save'
export default {
  components: {
    g5Nav,
    // IconsSwap,
    g5Footer,
    menuDropdown
  },
  mixins: [Alert, Save, Locations],
  data () {
    return {
      selectAll: false
    }
  },
  computed: {
    ...mapState({
      redirects: state => state.redirectStore,
      locations: state => state.locations.locations
    }),
    sortDesc: {
      get() { return this.$store.state.redirectStore.sortDesc },
      set(val) { this.$store.commit('redirectStore/SET', { 'sortDesc': val }) }
    },
    sortBy: {
      get() { return this.$store.state.redirectStore.sortBy },
      set(val) { this.$store.commit('redirectStore/SET', { 'sortBy': val }) }
    },
    totalRows: {
      get() { return this.$store.state.redirectStore.totalRows },
      set(val) { this.$store.commit('redirectStore/SET', { 'totalRows': val }) }
    },
    items() {
      return this.getItems()
    },
    sortOptions() {
      // Create an options list from our fields
      return this.redirects.fields
        .filter(f => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key }
        })
    }
  },
  async fetch({ store, params }) {
    try {
      const lpId = params.lpID
      const selects = await store.dispatch('initSelects/GET', lpId)
      await store.dispatch('locations/GET', { lpId, selects })
      // store.commit('redirectStore/SET_MAP_ITEMS', res)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  },
  created() {
    this.setRedirectProp({ 'totalRows': this.getItems().length })
    this.locations.length > 0
      ? this.showAlert(this.alertProps.successLoadRedirects, 'success')
      : this.showAlert(this.alertProps.errLoadMsg, 'danger')
  },
  methods: {
    ...mapMutations({
      updateRedirectProp: 'redirectStore/SET',
      updateRedirectVal: 'locations/UPDATE_REDIRECT'
    }),
    setRedirectProp(obj) {
      this.updateRedirectProp(obj)
    },
    copyUrls(column) {
      const filteredItems = this.$refs.redirectsTable.filteredItems
      const copyStr = filteredItems.map((item) => {
        return item.strategy === 'Cross Domain' && column === 'formatted_url'
          ? `${item.current_url} ${item.new_url}`.trim()
          : item[column].trim()
      }).join().replace(/ *, */g, '\n')
      this.$copyText(copyStr)
      this.updateBtnTxt(column)
    },
    save() {
      this.onSave()
      this.setRedirectProp({
        'saveButton': 'Saved!'
      })
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.setRedirectProp({ 'saveButton': 'Save' }), 3000)
    },
    updateBtnTxt(column) {
      const originalTxt = this.redirects[`${column}_btn`]
      this.setRedirectProp({
        [`${column}_btn`]: `${this.toTitleCase(column.replace('_', ' '))}'s Copied!`
      })
      // eslint-disable-next-line no-return-assign
      setTimeout(() => this.setRedirectProp({ [`${column}_btn`]: originalTxt }), 3000)
    },
    getItems() {
      return [
        ...this.locations.map((location) => {
          const { name, properties, id } = location
          return properties.redirects.items.map((redirect) => {
            return {
              name: `${name}`,
              internal: `${name} ${properties.street_address_1} ${properties.city}`,
              strategy: redirect.strategy,
              current_url: redirect.current_url,
              new_url: redirect.new_url ? redirect.new_url : '',
              formatted_url: redirect.formatted_url,
              locId: id,
              id: redirect.id,
              entered: redirect.entered
            }
          })
        })
      ].flat()
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.setRedirectProp({ 'currentPage': 1 })
    },
    selectAllChecks(val, data) {
      const filteredItems = this.$refs.redirectsTable.filteredItems
      filteredItems.forEach((filteredItem, index) => {
        this.updateCell(val, {
          item: filteredItem,
          field: data.field
        })
      })
    },
    updateCell(value, data) {
      const locationIndex = this.locations.findIndex((location) => {
        return location.id === data.item.locId
      })
      const itemIndex = this.locations[locationIndex]
        .properties.redirects.items.findIndex((redirect) => {
          return redirect.id === data.item.id
        })
      this.updateRedirectVal({
        locIdx: locationIndex,
        itemIdx: itemIndex,
        key: data.field.key,
        val: value
      })
    }
  }
}
</script>

<style scoped>

  .redirects-tbl .form-control {
    border:none;
    outline: none;
    box-shadow: none;
    height: 2em;
  }

  .copy-img {
    margin-bottom: 3px !important;
  }
  .copy-img:active{
   transform: scale(0.8);
  }

  .copy-btn {
    background: white!important;
    background-color: white!important;
    border: none !important;
    border-color: white !important;
    vertical-align: top;
    height: 17px !important;
    outline: none;
    box-shadow: none;
  }

  #strat-link:hover {
    color: var(--tertiary);
  }
</style>
