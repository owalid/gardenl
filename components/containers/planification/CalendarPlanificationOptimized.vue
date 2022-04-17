<template>
  <v-row>
    <v-col v-for="(month, indexMonth) in months" :key="month">
        <v-row align="center" justify="center" class="column-month mb-3">
          {{month}}
        </v-row>
        <div
          v-for="(implantations, indexPlanification) in planificationOptimized"
          :key="indexPlanification"
          class="pa-0 ma-0"
        >
          <!-- :class="[
            {
              'mt-10': Object.keys(planificationRaw).length > 1 && indexPlanification === Object.keys(planificationRaw).at(-1),
              'border-top': Object.keys(planificationRaw).length > 1 && indexPlanification === Object.keys(planificationRaw).at(-1)
            }
          ]" -->

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
  name: "CalendarPlanificationOptimized",
   data() {
    return {
      months: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'],
      numbers: 4,
      weeks: 4,
    }
  },
  computed: {
    ...mapGetters({
      planificationOptimized: 'getPlanificationOptimized'
    })
  },
  methods: {
    isRecolte(plank, indexMonth, week) {
      return plank.month_recolte === indexMonth && (plank.week_recolte === week || plank.week_recolte + 1 === week);
    },
    isSemis(plank, indexMonth, week) {
      return plank.month_semis === indexMonth && (plank.week_semis === week || plank.week_semis + 1 === week);
    },
    nextWeekShouldBeColored(plank, indexMonth) {
      indexMonth += 2;
      return this.isSemis(plank, indexMonth) || this.isRecolte(plank, indexMonth);
    },
    getColorWeek(plank, indexMonth, week) {
      indexMonth++;
      const specie = plank.filter(plank => plank.month_semis === indexMonth || plank.month_recolte === indexMonth)[0];
      if (specie) {
        // semis
        if (this.isSemis(specie, indexMonth, week)) {
          return `${specie.specie_name}semis`;
        }
        // recolte
        if (this.isRecolte(specie, indexMonth, week)) {
          return `${specie.specie_name}recolte`;
        }
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

.border-top {
  border-bottom: 1px solid rgba(0, 0, 0, 0.199);
}
</style>