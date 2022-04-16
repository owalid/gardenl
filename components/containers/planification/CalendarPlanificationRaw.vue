<template>
  <v-row>
    <v-col v-for="(month, indexMonth) in months" :key="month">
        <v-row align="center" justify="center" class="column-month mb-3">
          {{month}}
        </v-row>
        <div
          v-for="(implantations, indexPlanification) in planificationRaw"
          :key="indexPlanification"
          class="pa-0 ma-0"
          :class="[{'mt-10': indexPlanification === Object.keys(planificationRaw).at(-1)}]"
        >

          <v-row v-for="(implantation, indexImplantation) in implantations" :key="indexImplantation" class="implantation-border">
              <v-col
                v-for="week in weeks"
                :key="week"
                class="pa-0 ma-0 column-border"
              >
                <v-row
                  v-for="(plank, indexPlank) in implantation"
                  :key="indexPlank"
                  :ref="`plank-${plank.uuid}-${week}-${indexMonth}`"
                  :class="`plank-${plank.uuid}-${week}-${indexMonth}`"
                  class="pa-0 ma-0 mb-1"
                >
                  <!-- :class="{'row-border': nextWeekShouldBeColored(plank, indexMonth)}" -->
                  <v-sheet
                    :color="getColorWeek(plank, indexMonth, week)"
                    elevation="0"
                    height="30"
                    width="100%"
                  ></v-sheet>
                </v-row>
              </v-col>
          </v-row>
        </div>
      </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "CalendarPlanificationRaw",
   data() {
    return {
      months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'],
      numbers: 4,
      weeks: 4,
    }
  },
  computed: {
    ...mapGetters({
      planificationRaw: 'getPlanificationRaw',
      planificationOptimized: 'getPlanificationOptimized'
    })
  },
  methods: {
    deleteColumnLeftBorder(plank, indexMonth, week) {
      if ((this.isSemis(plank, indexMonth) && !this.isFirstWeekSemis(plank, indexMonth)) || (this.isRecolte(plank, indexMonth) && !this.isFirstMonthRecolte(plank, indexMonth))) {
       this.$nextTick(() => {
          const elmt = this.$refs[`plank-${plank.uuid}-${week}-${indexMonth-1}`][0];
          elmt.parentNode.classList.remove('column-border')
        })
      }
    },
    isFirstMonthRecolte(plank, indexMonth, week) {
      return indexMonth === plank.month_start_recolte && week === 0;
    },
    isFirstWeekSemis(plank, indexMonth, week) {
      return indexMonth === plank.month_start_semis && week === 0;
    },
    isRecolte(plank, indexMonth) {
      return plank.month_start_recolte <= indexMonth && plank.month_end_recolte >= indexMonth
    },
    isSemis(plank, indexMonth) {
      return plank.month_start_semis <= indexMonth && plank.month_end_semis >= indexMonth
    },
    nextWeekShouldBeColored(plank, indexMonth) {
      indexMonth += 2;
      return this.isSemis(plank, indexMonth) || this.isRecolte(plank, indexMonth);
    },
    getColorWeek(plank, indexMonth, week) {
      indexMonth++;
      this.deleteColumnLeftBorder(plank, indexMonth, week);
      // semis
      if (this.isSemis(plank, indexMonth)) {
        return `${plank.specie_name}recolte`;
      }
      // recolte
      if (this.isRecolte(plank, indexMonth)) {
        return `${plank.specie_name}semis`;
      }
      return ''
    }
  }
}
</script>
<style lang="scss" scoped>
.colored-week {
  background: red;
  width: auto;
  height: 100%;
}

.implantation-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.199);
}
.column-border {
  border-left: 1px solid rgba(0, 0, 0, 0.199);
}

.column-month {
  padding-top: 20px;
  padding-bottom: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.199);
  border-top: 1px solid rgba(0, 0, 0, 0.199);
  border-bottom: 1px solid rgba(0, 0, 0, 0.199);
  z-index: 1;
}
</style>