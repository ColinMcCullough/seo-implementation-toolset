import Papa from 'papaparse'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      propertiesToString: [
        'neighborhood',
        'neighborhood_2',
        'landmark_1_name',
        'apartment_amenity_1',
        'apartment_amenity_2',
        'apartment_amenity_3',
        'community_amenity_1',
        'community_amenity_2',
        'community_amenity_3'
      ],
      arrayToString: [
        'additional_amenities_apartment',
        'additional_amenities_community'
      ],
      addProp: [
        'neighborhood_keywords',
        'landmark_keywords',
        'amenity_keywords',
        'comm_amenity_keywords',
        'class',
        'primary_type',
        'current_website',
        'service_level',
        'negative_keywords',
        'phase',
        'fax',
        'package',
        'latitude',
        'timezone',
        'longitude',
        'service_1',
        'service_2',
        'service_3',
        'service_4',
        'service_5',
        'fb_pixel_id',
        'access_hours',
        'hide_address',
        'listing_logo',
        'off_platform',
        'office_hours',
        'record_calls',
        'special_date',
        'yext_enabled',
        'audit_comment',
        'bing_utm_code',
        'core_store_id',
        'forms_enabled',
        'ga_profile_id',
        'gmb_short_url',
        'listing_phone',
        'payment_types',
        'phone_enabled',
        'profile_image',
        'ajax_whitelist',
        'business_email',
        'call_plan_name',
        'ga_tracking_id',
        'general_images',
        'google_plus_id',
        'group_ct_phone',
        'vimeo_username',
        'appointment_url',
        'custom_vertical',
        'google_utm_code',
        'landmark_1_type',
        'landmark_2_type',
        'landmark_3_type',
        'phone_whitelist',
        'reactivated_urn',
        'thumbnail_image',
        'tumblr_username',
        'chatmeter_paused',
        'feature_services',
        'iframe_whitelist',
        'no_call_tracking',
        'reserved_numbers',
        'street_address_2',
        'verified_address',
        'core_store_number',
        'facebook_utm_code',
        'instagram_user_id',
        'bing_listing_phone',
        'business_open_date',
        'google_cover_image',
        'location_amenities',
        'business_owner_name',
        'chatmeter_loc_exist',
        'community_service_1',
        'community_service_2',
        'foursquare_username',
        'products_and_brands',
        'thumbnail_file_name',
        'thumbnail_file_size',
        'twitter_cover_image',
        'facebook_cover_image',
        'google_listing_phone',
        'thumbnail_updated_at',
        'additional_categories',
        'call_plan_sync_status',
        'chatmeter_gmb_form_id',
        'chatmeter_location_id',
        'chatmeter_paused_note',
        'client_location_index',
        'linkedin_account_type',
        'thanks_page_whitelist',
        'call_plan_sync_message',
        'chatmeter_gmb_email_id',
        'external_thumbnail_url',
        'facebook_listing_phone',
        'override_listing_phone',
        'thumbnail_content_type',
        'da_optmization_strategy',
        'outbound_link_whitelist',
        'profile_image_public_id',
        'standard_form_whitelist',
        'exclude_from_corp_search',
        'total_points_of_interest',
        'ad_source_signaling_token',
        'call_tracking_ivr_enabled',
        'chatmeter_gmb_campaign_id',
        'listing_management_active',
        'location_listing_category',
        'off_platform_location_url',
        'override_listing_utm_code',
        'reserved_numbers_purposes',
        'override_listing_phone_note',
        'ad_source_signaling_endpoint',
        'reserved_numbers_descriptions'
      ]
    }
  },
  computed: {
    ...mapState({
      exportData: state => state.export,
      locationtbl: state => state.locationsTable,
      locations: state => state.locations.locations,
      addPropFields: state => state.addImportProps
    })
  },
  methods: {
    downloadCSV(csvurl) {
      const link = document.createElement('a')
      link.href = csvurl
      link.setAttribute('download', 'location-export.csv')
      document.body.appendChild(link)
      link.click()
    },
    generateCSV(arr) {
      const unparsedcsv = Papa.unparse(arr)
      const file = new Blob([unparsedcsv], { type: 'text/csv' })
      return URL.createObjectURL(file)
    },
    excludedExportProp() {
      return Object.keys(this.addPropFields).concat(this.addProp)
    },
    getSelectedLocationIds() {
      return this.locationtbl.selected
        ? this.locationtbl.selected.map(selected => selected.value)
        : null
    },
    exportLocations() {
      const locIDs = this.getSelectedLocationIds()
      if (locIDs) {
        const selectedLocations = []
        this.locations.forEach((location) => {
          const formattedLoc = {}
          if (locIDs.includes(location.id)) {
            const entries = Object.entries(location.properties)
            const filterVal = this.excludedExportProp()
            formattedLoc.name = location.name
            for (const [key, val] of entries) {
              if (!filterVal.includes(key)) {
                if (this.propertiesToString.includes(key) && val.length > 0) {
                  formattedLoc[key] = val[0].name
                } else if (this.arrayToString.includes(key) && val.length > 0) {
                  formattedLoc[key] = val.map(obj => obj.name).join(', ')
                } else {
                  formattedLoc[key] = val
                }
              }
            }
            selectedLocations.push(formattedLoc)
          }
        })
        const csvurl = this.generateCSV(selectedLocations)
        this.downloadCSV(csvurl)
      }
    }
  }
}
