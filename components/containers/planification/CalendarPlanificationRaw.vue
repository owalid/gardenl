<template>
  <div>
    <v-row class="mx-2 mb-10" justify="center">
      <v-col v-for="(month, indexMonth) in months" :key="month">
        <v-row
          align="center"
          justify="center"
          class="column-month mb-3"
          :class="{'column-last-month-border': isLastMonth(indexMonth)}"
        > <!-- MONTH -->
          {{month}}
        </v-row>
        <div v-if="!$fetchState.pending">
          <div
            v-for="(implantations, indexPlanification) in planificationRaw"
            :key="indexPlanification"
            class="pa-0 ma-0"
             :class="{
              'mt-10': Object.keys(planificationRaw).length > 1 && planificationRaw[Object.keys(planificationRaw)[1]].length > 0 && indexPlanification === Object.keys(planificationRaw)[1],
              'border-top': Object.keys(planificationRaw).length > 1 && planificationRaw[Object.keys(planificationRaw)[1]].length > 0 && indexPlanification === Object.keys(planificationRaw)[1]
            }"
          > <!-- PLANK -->
          <div
            v-if="planificationRaw[indexPlanification].length > 0"
            class="planification-row"
          >
              <v-row
                v-if="indexMonth === 0"
                class="mt-2"
                align="center" justify="center"
              >
                <v-img
                  :src="planificationInfo[indexPlanification].img"
                  class="img-planification"
                  contain
                />
              </v-row>
              <v-row
                v-if="indexMonth === 0"
                align="center"
                justify="center"
                class="mt-2"
              >
                {{planificationInfo[indexPlanification].label}}s
              </v-row>
          </div>
              <!-- <template></template> -->
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
                              v-if="isFirstWeekSemis(plank, indexMonth, week)"
                              :src="`/species_icons/low/${plank.specie_name}.png`"
                              class="img-species"
                              contain
                            />
                          </div>
                        </v-sheet>
                      </template>
                      <span>
                        Variété: {{ plank.complete_name }} <br />
                        Fertilisation: {{ plank.fertilization_label }} <br />
                        Implantation: {{ plank.implantation }}
                      </span>
                    </v-tooltip>
                  </v-row>
                </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="$fetchState.pending" align="center" justify="center">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </v-row>
  </div>
</template>
<script>
import CalendarPlanificationMixin from "~/mixins/CalendarPlanificationMixin";

export default {
  name: "CalendarPlanificationRaw",
  mixins: [CalendarPlanificationMixin],
  data() {
    return {
      planificationRaw: []
    }
  },
  async fetch() {
    this.planificationRaw = await this.$plannification.getPlanificationRaw();
    await this.$nextTick();
  },
  mounted() {
    this.$nuxt.$on('updatedSpecies', this.$fetch);
  },
  methods: {
    deleteColumnLeftBorder(plank, indexMonth, week) {
      if ((this.isSemis(plank, indexMonth) && !this.isFirstWeekSemis(plank, indexMonth, week)) || (this.isRecolte(plank, indexMonth) && !this.isFirstMonthRecolte(plank, indexMonth, week))) {
       this.$nextTick(() => {
          const elmt = this.$refs[`plank-${plank.uuid}-${week}-${indexMonth}`][0];
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
      indexMonth++;
      return this.isSemis(plank, indexMonth) || this.isRecolte(plank, indexMonth);
    },
    getColorWeek(plank, indexMonth, week) {
      // indexMonth++;
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

.planification-row {
  height: 100px;
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

.img-planification {
  width: 40px;
  height: 40px;
}
</style>