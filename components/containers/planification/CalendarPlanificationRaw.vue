<template>
  <v-row class="mx-2" justify="center">
    <v-col v-for="(month, indexMonth) in months" :key="month">
        <v-row
          align="center"
          justify="center"
          class="column-month mb-3"
          :class="{'column-last-month-border': isLastMonth(indexMonth)}"
        > <!-- MONTH -->
          {{month}}
        </v-row>
        <div
          v-for="(implantations, indexPlanification) in planificationRaw"
          :key="indexPlanification"
          class="pa-0 ma-0"
        > <!-- PLANK -->
          <v-row
            v-for="(implantation, indexImplantation) in implantations"
            :key="indexImplantation"
            class="implantation-border"
            :class="{'mt-7': indexImplantation > 0}"
          > <!-- IMPLANTATION -->
              <v-col
                v-for="week in weeks"
                :key="week"
                class="pa-0 ma-0 column-border"
                :class="{'column-last-week-border': isLastMonth(indexMonth) && isLastWeek(week)}"
              > <!-- WEEK -->
                <v-row
                  v-for="(plank, indexPlank) in implantation"
                  :key="indexPlank"
                  :ref="`plank-${plank.uuid}-${week}-${indexMonth}`"
                  :class="`plank-${plank.uuid}-${week}-${indexMonth}`"
                  class="pa-0 ma-0 my-1"
                > <!-- PLANK -->
                  <v-tooltip
                    left
                    max-width="500px"
                    :disabled="getColorWeek(plank, indexMonth, week) === ''"
                  >
                      <template #activator="{ on, attrs }">
                        <v-sheet
                          :color="getColorWeek(plank, indexMonth, week)"
                          elevation="0"
                          height="30"
                          width="100%"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <div class="d-flex flex-column align-self-center justify-content-center" style="height: 30px">
                            <v-img
                              v-if="isFirstWeekSemis(plank, indexMonth+1, week)"
                              :src="`/species_icons/${plank.specie_name}.svg`"
                              class="img-species"
                              contain
                            />
                          </div>
                        </v-sheet>
                      </template>
                      <span>{{ plank.complete_name }}</span>
                   </v-tooltip>
                </v-row>
              </v-col>
          </v-row>
        </div>
      </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from "vuex";
import CalendarPlanificationMixin from "~/mixins/CalendarPlanificationMixin";

export default {
  name: "CalendarPlanificationRaw",
  mixins: [CalendarPlanificationMixin],
  computed: {
    ...mapGetters({
      planificationRaw: 'getPlanificationRaw'
    })
  },
  methods: {
    deleteColumnLeftBorder(plank, indexMonth, week) {
      if ((this.isSemis(plank, indexMonth) && !this.isFirstWeekSemis(plank, indexMonth, week)) || (this.isRecolte(plank, indexMonth) && !this.isFirstMonthRecolte(plank, indexMonth, week))) {
       this.$nextTick(() => {
          const elmt = this.$refs[`plank-${plank.uuid}-${week}-${indexMonth-1}`][0];
          elmt.parentNode.classList.remove('column-border')
        })
      }
    },
    isFirstMonthRecolte(plank, indexMonth, week) {
      return indexMonth === plank.month_start_recolte && week === 1;
    },
    isFirstWeekSemis(plank, indexMonth, week) {
      return indexMonth === plank.month_start_semis && week === 1;
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
        return `${plank.specie_name}semis`;
      }
      // recolte
      if (this.isRecolte(plank, indexMonth)) {
        return `${plank.specie_name}recolte`;
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

  &:not(:first-child) {
    border-top: 1px solid rgba(0, 0, 0, 0.199);
  }
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
}

.column-last-month-border,  .column-last-week-border {
  border-right: 1px solid rgba(0, 0, 0, 0.199);
}

.border-top {
  border-bottom: 1px solid rgba(0, 0, 0, 0.199);
}
.img-species {
  width: 20px;
  height: 20px;
}
</style>