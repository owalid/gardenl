<template>
  <v-container fluid>
    <v-row justify="center" class="my-8">
      <h1 class="primary--text">
        Planification des cultures sans succession
      </h1>
    </v-row>
    <planification-container />
  </v-container>
</template>
<script>
import PlanificationContainer from "~/components/containers/PlanificationContainer"
export default {
  name: "PlanificationPage",
  components: {PlanificationContainer}
}
</script>