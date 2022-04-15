<template>
  <v-app dark>
    <v-app-bar app flat color="primary" dense>
      <v-row justify="end" align="center">
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">TOTAL</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">N planches</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">N ETP</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">N €</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-5">N m2</h4>
         <v-icon small color="white" class="mr-10 cursor-pointer">fa-question-circle</v-icon>
      </v-row>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>