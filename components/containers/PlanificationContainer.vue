<template>
  <div>
    <v-row justify="end" class="mr-10">
      <v-switch
        v-model="activatedOptimisation"
        label="Activer l'optimisation"
      >
      </v-switch>
    </v-row>
    <calendar-planification-raw />
  </div>
</template>
<script>
import CalendarPlanificationRaw from "~/components/containers/planification/CalendarPlanificationRaw.vue";

export default {
  name: "PlanificationContainer",
  components: {CalendarPlanificationRaw},
   data() {
    return {
      activatedOptimisation: false,
    }
  }
}
</script>
