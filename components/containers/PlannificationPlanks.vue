<template>
  <div>
    <div
      v-for="(implantations, indexPlanification) in planificationOptimized"
      :key="indexPlanification"
      class="pa-0 ma-0"
      :class="{
        'mt-10': Object.keys(planificationOptimized).length > 1 && indexPlanification === Object.keys(planificationOptimized)[1],
        'border-top': Object.keys(planificationOptimized).length > 1 && indexPlanification === Object.keys(planificationOptimized)[1]
      }"
    > <!-- PLANK -->
    <div
      v-if="planificationOptimized[indexPlanification].length > 0"
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
      <v-row
        v-for="(implantation, indexImplantation) in implantations"
        :key="indexImplantation"
        class="implantation-border"
        :class="{'mt-7': indexImplantation > 0}"
      > <!-- IMPLANTATION -->
        <v-col
          v-for="week in 4"
          :key="week"
          class="pa-0 ma-0 column-border"
          :class="{'column-last-week-border': indexMonth === 12 && week === 4}"
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
</template>
<script>
import TooltipSpecie from "~/components/containers/TooltipSpecie";

export default {
  name: "PlannificationPlanks",
  components: {
    TooltipSpecie,
  },
  props: {
    indexMonth: {
      type: Number,
      required: true
    },
    planificationInfo: {
      type: Object,
      required: true
    },
    planificationOptimized: {
      type: Object,
      required: true
    },
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