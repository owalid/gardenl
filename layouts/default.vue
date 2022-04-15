<template>
  <v-app dark>
    <v-app-bar app flat color="primary" dense>
      <v-row justify="end" align="center">
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">TOTAL</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">{{ totalSpeciesSelected.totalPlank }} planches</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">{{ totalSpeciesSelected.etp }} ETP</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-10">{{ totalSpeciesSelected.sumYield }} €</h4>
        <h4 class="font-weight-medium lgrey--text my-0 mr-5">{{ totalSpeciesSelected.sumSurface }} m2</h4>
         <v-icon small color="white" class="mr-10 cursor-pointer">fa-question-circle</v-icon>
      </v-row>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      totalSpeciesSelected: 'getTotalSpeciesSelected',
    })
  }
}
</script>