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
          v-for="(implantations, indexPlanification) in planificationOptimized"
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
                  :ref="`plank-${getCurrentSpecie(plank, indexMonth+1) ? getCurrentSpecie(plank, indexMonth+1).uuid : ''}-${week}-${indexMonth}`"
                  :class="`plank-${getCurrentSpecie(plank, indexMonth+1) ? getCurrentSpecie(plank, indexMonth+1).uuid : ''}-${week}-${indexMonth}`"
                  class="pa-0 ma-0 my-1"
                > <!-- PLANK -->
                   <v-tooltip
                      left
                      max-width="500px"
                      :disabled="getCurrentSpecie(plank, indexMonth+1) === null || week > 2"
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
                              v-if="getCurrentSpecie(plank, indexMonth+1) && week === getCurrentSpecie(plank, indexMonth+1).week_semis && getColorWeek(plank, indexMonth, week).split('semis').length > 1"
                              :src="`/species_icons/${getColorWeek(plank, indexMonth, week).split('semis')[0]}.svg`"
                              class="img-species"
                              contain
                            />
                          </div>
                        </v-sheet>
                      </template>
                      <span v-if="getCurrentSpecie(plank, indexMonth+1) !== null && week <= 2">
                        {{ getCurrentSpecie(plank, indexMonth+1).complete_name }}
                      </span>
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
  name: "CalendarPlanificationOptimized",
  mixins: [CalendarPlanificationMixin],
  computed: {
    ...mapGetters({
      planificationOptimized: 'getPlanificationOptimized'
    })
  },
  methods: {
    deleteColumnLeftBorder(specie, indexMonth, week) {
      if ((this.isSemis(specie, indexMonth, week) && week === 2) || (this.isRecolte(specie, indexMonth, week) && week === 2)) {
       this.$nextTick(() => {
          const elmt = this.$refs[`plank-${specie.uuid}-${week}-${indexMonth-1}`][0];
          elmt.parentNode.classList.remove('column-border')
        })
      }
    },
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
    getCurrentSpecie(plank, indexMonth) {
      return plank.find(specie => specie.month_semis === indexMonth || specie.month_recolte === indexMonth) || null
    },
    getColorWeek(plank, indexMonth, week) {
      indexMonth++;
      const specie = this.getCurrentSpecie(plank, indexMonth);
      if (specie) {
        // this.deleteColumnLeftBorder(specie, indexMonth, week);
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

  &:not(:first-child) {
    border-top: 1px solid rgba(0, 0, 0, 0.199);
  }
}
.column-border {
  border-left: 1px solid rgba(0, 0, 0, 0.199);
  // border-bottom: 1px solid rgba(0, 0, 0, 0.199);
  // border-left: 1px solid rgba(149, 19, 19, 0.892);
}

.column-month {
  padding-top: 20px;
  padding-bottom: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.199);
  border-top: 1px solid rgba(0, 0, 0, 0.199);
  border-bottom: 1px solid rgba(0, 0, 0, 0.199);
  z-index: 1;
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