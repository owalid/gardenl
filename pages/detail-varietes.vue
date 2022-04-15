<template>
  <v-container>
    <!-- <p>Hello world</p> -->
    <detail-species-table />
    <v-row>
      <v-row
        align="end"
        justify="start"
        class="mt-7"
      >
        <v-btn
          to="/"
        >
          Retour
        </v-btn>
      </v-row>
      <v-row align="end" justify="end" class="mt-7">
        <v-btn color="primary">
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