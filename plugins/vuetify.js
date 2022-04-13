import Vue from 'vue'
import Vuetify, {
  VIcon,
  VBtn,
  VCheckbox,
  VApp,
  VAppBar,
  VContainer,
  VOverlay,
  VTooltip
} from 'vuetify/lib'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.use(Vuetify, {
  components: {
    VIcon,
    VBtn,
    VApp,
    VAppBar,
    VContainer,
    VCheckbox,
    VOverlay,
    VTooltip
  },
  icons: {
    iconfont: 'fa'
  }
})