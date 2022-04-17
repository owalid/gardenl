<template>
  <v-dialog v-model="is_open" max-width="920">
    <template #activator="{ on }">
      <v-icon small color="white" class="mr-10 cursor-pointer" v-on="on">fa-question-circle</v-icon>
    </template>
    <v-card class="pa-6">
      <h1 class="primary--text">
        Variétés
      </h1>
      <v-row>
        <detail-species-table x-small />
      </v-row>
      <v-row class="mr-2 mt-10" justify="end">
        <v-btn
          class="mb-2" plain small color="primary"
          @click="is_open = false"
        >
          Fermer
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import DetailSpeciesTable from '~/components/tables/DetailSpeciesTable.vue'

export default {
  name: "ModalDetailSpeciesSelected",
  components: {DetailSpeciesTable},
  data() {
    return {
      is_open: false
    }
  }
}
</script>