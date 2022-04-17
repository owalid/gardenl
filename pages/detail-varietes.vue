<template>
  <v-container>
    <v-row justify="center" class="my-8">
      <h1 class="primary--text">
        Variétés
      </h1>
    </v-row>
    <detail-species-table />
    <v-row>
      <v-row
        align="end"
        justify="start"
        class="mt-7"
      >
        <v-btn
          outlined
          color="primary"
          to="/"
        >
          Retour
        </v-btn>
      </v-row>
      <v-row align="end" justify="end" class="mt-7">
        <v-btn
          color="primary"
          to="/planification"
        >
          Plannifier
        </v-btn>
      </v-row>
    </v-row>
  </v-container>
</template>
<script>
import DetailSpeciesTable from '~/components/tables/DetailSpeciesTable'
export default {
  name: "DetailVarietesPage",
  components: {DetailSpeciesTable}
}
</script>