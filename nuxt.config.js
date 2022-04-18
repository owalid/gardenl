import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - app',
    title: 'app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuetify',
    '~/plugins/plannification'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'nuxt-webfontloader',
    'cookie-universal-nuxt',
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    theme: {
      themes: {
        light: {
          primary: "#73AE2C",
          accent: colors.grey.darken3,
          lgrey: colors.grey.lighten2,
          secondary: '#4C0976',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,

          eggplantsemis: colors.deepPurple.lighten1,
          eggplantrecolte: colors.deepPurple.lighten4,

          beetsemis: colors.pink.lighten1,
          beetrecolte: colors.pink.lighten4,

          carrotsemis: colors.deepOrange.lighten1,
          carrotrecolte: colors.deepOrange.lighten4,

          celerysemis: colors.lime.lighten1,
          celeryrecolte: colors.lime.lighten4,

          zucchinisemis: colors.indigo.lighten1,
          zucchinirecolte: colors.indigo.lighten4,

          beansemis: colors.brown.lighten1,
          beanrecolte: colors.brown.lighten4,

          lettucesemis: colors.lightGreen.lighten1,
          lettucerecolte: colors.lightGreen.lighten4,

          onionsemis: colors.amber.lighten1,
          onionrecolte: colors.amber.lighten4,

          leeksemis: colors.cyan.lighten1,
          leekrecolte: colors.cyan.lighten4,

          peasemis: colors.teal.lighten1,
          pearecolte: colors.teal.lighten4,

          radishsemis: colors.purple.lighten1,
          radishrecolte: colors.purple.lighten4,

          tomatosemis: colors.red.lighten1,
          tomatorecolte: colors.red.lighten4,

        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^vuetify/, 'vuex-persist'],
    extractCSS: true,
    standalone: true,
    ignoreOrder: false,
    filenames: {
      chunk: ({ isDev }) => (isDev ? '[name].js' : '[id].[contenthash].js')
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        preserveLineBreaks: false,
        collapseWhitespace: true
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: 'owalid',
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          },
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        }
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
