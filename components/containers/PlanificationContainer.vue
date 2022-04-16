<template>
  <div>
    <v-row justify="end" class="mr-10">
      <v-switch
        v-model="activatedOptimisation"
        label="Activer l'optimisation"
      >
      </v-switch>
    </v-row>
    <v-row>
      <v-col v-for="month in months" :key="month">
        <v-row align="center" justify="center" class="column-month">
          {{month}}
        </v-row>
        <v-row>
          <v-col v-for="week in weeks" :key="week" class="px-0 column-week">
            <v-row v-for="number in numbers" :key="number">
             {{ number }} 
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "PlanificationContainer",
   data() {
    return {
      months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'],
      numbers: 4,
      weeks: 4,
      activatedOptimisation: false,
    }
  },
  computed: {
    ...mapGetters({
      planificationRaw: 'getPlanificationRaw',
      planificationOptimized: 'getPlanificationOptimized'
    })
  }
}
</script>
<style lang="scss" scoped>
.column-week {
  background: red;
  border-left: 1px solid rgba(0, 0, 0, 0.199);
  border-right: 1px solid rgba(0, 0, 0, 0.199);
}
.column-month {
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.199);
}
</style>