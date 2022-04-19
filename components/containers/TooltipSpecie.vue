<template>
    <v-tooltip
      left
      max-width="500px"
      :disabled="week > currentSpecie.week_semis + 1 || week < currentSpecie.week_semis || week > currentSpecie.week_recolte + 1 || week < currentSpecie.week_recolte"
    >
      <template #activator="{ on, attrs }">
        <v-sheet
          :color="colorWeek"
          elevation="0"
          height="30"
          width="100%"
          v-bind="attrs"
          v-on="on"
        >
          <div class="d-flex flex-column align-self-center justify-content-center" style="height: 30px">
            <v-img
              v-if="currentSpecie && currentSpecie.week_semis === week"
              :src="`/species_icons/${currentSpecie.specie_name}.svg`"
              class="img-species"
              contain
            />
          </div>
        </v-sheet>
      </template>
      <span v-if="currentSpecie !== null && week <= 2">
        {{ currentSpecie.complete_name }}
      </span>
    </v-tooltip>
</template>
<script>
export default {
  name: "TooltipSpecie",
  props: {
    plank: {
      type: Array,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    week: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentSpecie: {}
    }
  },
  fetch() {
    this.currentSpecie = this.plank.find(specie => specie.month_semis === this.indexMonth || specie.month_recolte === this.indexMonth) || null
    this.colorWeek = this.getColorWeek(this.currentSpecie, this.indexMonth, this.week)
  },
  methods: {
    isRecolte() {
      return this.currentSpecie.month_recolte === this.indexMonth && (this.currentSpecie.week_recolte === this.week || this.currentSpecie.week_recolte + 1 === this.week);
    },
    isSemis() {
      return this.currentSpecie.month_semis === this.indexMonth && (this.currentSpecie.week_semis === this.week || this.currentSpecie.week_semis + 1 === this.week);
    },
    getColorWeek() {
      if (this.currentSpecie) {
        // semis
        if (this.isSemis(this.currentSpecie, this.indexMonth, this.week)) {
          return `${this.currentSpecie.specie_name}semis`;
        }
        // recolte
        if (this.isRecolte(this.currentSpecie, this.indexMonth, this.week)) {
          return `${this.currentSpecie.specie_name}recolte`;
        }
      }
      return ''
    }
  },
}
</script>