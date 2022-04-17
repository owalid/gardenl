<template>
  <v-app-bar app flat color="primary" dense>
    <v-row justify="end" align="center">
      <h4 class="font-weight-medium lgrey--text my-0 mr-10">TOTAL</h4>
      <h4 class="font-weight-medium lgrey--text my-0 mr-10">{{ totalSpeciesSelected.totalPlank }} planches</h4>
      <h4 class="font-weight-medium lgrey--text my-0 mr-10">{{ totalSpeciesSelected.etp }} ETP</h4>
      <h4 class="font-weight-medium lgrey--text my-0 mr-10">{{ totalSpeciesSelected.sumYield }} €</h4>
      <h4 class="font-weight-medium lgrey--text my-0 mr-5">{{ totalSpeciesSelected.sumSurface }} m2</h4>
      <modal-detail-species-selected />
    </v-row>
  </v-app-bar>
</template>
<script>
import { mapGetters } from 'vuex'
import ModalDetailSpeciesSelected from '~/components/modals/ModalDetailSpeciesSelected'

export default {
  name: "NavigationBar",
  components: {ModalDetailSpeciesSelected},
   computed: {
    ...mapGetters({
      totalSpeciesSelected: 'getTotalSpeciesSelected',
    })
  }
}
</script>