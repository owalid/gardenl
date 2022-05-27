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
         <plannification-planks
            :planification-optimized="planificationOptimized"
            :planification-info="planificationInfo"
            :index-month="indexMonth"
         />
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
import { mapGetters } from 'vuex'
import CalendarPlanificationMixin from "~/mixins/CalendarPlanificationMixin";
import PlannificationPlanks from '~/components/containers/PlannificationPlanks';

export default {
  name: "CalendarPlanificationOptimized",
  components: {
    PlannificationPlanks
  },
  mixins: [CalendarPlanificationMixin],
  data() {
    return {
      currentPlankWeek: [],
      currentPlankIndex: -1,
      allSpecies: {}
    }
  },
  async fetch() {
    await this.$nextTick();
  },
  computed: {
    ...mapGetters({
      planificationOptimized: 'getPlanificationOptimized'
    })
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

.planification-row {
  height: 100px;
}

.img-planification {
  width: 40px;
  height: 40px;
}
</style>