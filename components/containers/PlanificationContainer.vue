<template>
  <div>
    <v-row justify="center" class="my-8">
      <h1 class="primary--text">
        Planification des cultures {{ (activatedOptimisation) ? 'avec' : 'sans'}} succession
      </h1>
    </v-row>
    <v-row justify="end" class="mr-10">
      <v-switch
        v-model="activatedOptimisation"
        label="Succession"
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
      activatedOptimisation: this.$store.state.activatedOptimisation,
    }
  },
  watch: {
    activatedOptimisation(newValue) {
      this.$store.commit('setActivatedOptimisation', newValue);
    }
  }
}
</script>
