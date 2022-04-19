<template>
  <v-container fluid>
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