<template>
  <div>
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
        <div v-if="!$fetchState.pending">
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
                  class="pa-0 ma-0 my-1"
                > <!-- PLANK -->
                  <tooltip-specie
                    :plank="plank"
                    :month="indexMonth"
                    :week="week"
                  />
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
        size="24"
        width="3"
      />
    </v-row>
  </div>
</template>
<script>
import CalendarPlanificationMixin from "~/mixins/CalendarPlanificationMixin";
import TooltipSpecie from "~/components/containers/TooltipSpecie";

export default {
  name: "CalendarPlanificationOptimized",
  components: {
    TooltipSpecie
  },
  mixins: [CalendarPlanificationMixin],
  data() {
    return {
      planificationOptimized: [],
      currentPlankWeek: [],
      currentPlankIndex: -1,
      allSpecies: {}
    }
  },
  async fetch() {
    this.planificationOptimized = this.$plannification.getPlanificationOptimized();
    await this.$nextTick();
  },
  mounted() {
    this.$nuxt.$on('updatedSpecies', this.$fetch);
  },
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