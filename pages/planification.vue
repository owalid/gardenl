<template>
  <v-container fluid>
    <v-row justify="center" class="my-8">
      <h1 class="primary--text">
        Planification des cultures sans succession
      </h1>
    </v-row>
    <!-- <v-row justify="center"> -->
    <planification-container />
    <!-- </v-row> -->

    <v-row
      align="end"
      justify="start"
      class="mt-10 ml-5"
    >
      <v-btn
        outlined
        color="primary"
        to="/detail-varietes"
      >
        Retour
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import PlanificationContainer from "~/components/containers/PlanificationContainer"
export default {
  name: "PlanificationPage",
  components: {PlanificationContainer}
}
</script>