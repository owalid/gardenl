<template>
  <div>
    <v-row justify="end" class="mr-10">
      <v-switch
        v-model="activatedOptimisation"
        label="Activer l'optimisation"
      >
      </v-switch>
    </v-row>
    <calendar-planification-raw v-show="!activatedOptimisation" />
    <calendar-planification-optimized v-show="activatedOptimisation" />
  </div>
</template>
<script>
import CalendarPlanificationRaw from "~/components/containers/planification/CalendarPlanificationRaw.vue";
import CalendarPlanificationOptimized from "~/components/containers/planification/CalendarPlanificationOptimized.vue";

export default {
  name: "PlanificationContainer",
  components: {CalendarPlanificationRaw, CalendarPlanificationOptimized},
   data() {
    return {
      activatedOptimisation: true,
    }
  }
}
</script>
