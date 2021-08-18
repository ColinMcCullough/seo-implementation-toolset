require('dotenv').config()

module.exports = {
  mode: 'spa',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  server: {
    host: process.env.BASE_URL || 'localhost',
    port: process.env.PORT || 3000
  },
  loading: {
    color: '#7898ad',
    failedColor: '#ff0033',
    continuous: true,
    throttle: 300,
    duration: 2000,
    height: '4px'
  },
  loadingIndicator: '@/static/loading.html',
  css: [
    '@/assets/main.scss'
  ],
  plugins: [
    '@/plugins/icons.js',
    '@/plugins/clipboard.js',
    '@/plugins/autowidth.js'
  ],
  buildModules: [
    '@nuxtjs/eslint-module'
  ],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv'
  ],
  axios: {
    browserBaseURL: `//${process.env.BROWSER_URL}`
  },
  build: {
    extend (config, ctx) {
    }
  }
}
