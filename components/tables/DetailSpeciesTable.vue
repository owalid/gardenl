<template>
  <v-container>
    <v-row class="mb-10 mr-5">
      <v-row align="start" justify="end">
        <v-btn outlined small color="red" @click="deleteAllSpecies">
          Tout supprimer <v-icon x-small class="ml-3">fas fa-trash</v-icon>
        </v-btn>
      </v-row>
    </v-row>
     <v-simple-table :key="key">
      <template #default>
        <thead>
          <tr>
            <th></th>
            <th>Variété</th>
            <th>Type</th>
            <th>Planches</th>
            <th>Rendement</th>
            <th>CA (€)</th>
            <th>
              Surface
              <v-tooltip left max-width="300px">
                <template #activator="{ on, attrs }">
                  <v-icon
                    class="ml-1"
                    x-small
                    v-bind="attrs"
                    v-on="on"
                  >
                    fa-question-circle
                  </v-icon>
                </template>
                <span>Surface sans maximisation avec la rotation. Une planche n’est occupé que par un seul légume.</span>
              </v-tooltip>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(specieDetailed, idSpecieDetailed) in speciesDetailed" :key="idSpecieDetailed">
            <td>
              <img class="img_specie" :src="`/species_icons/${specieDetailed.specie_index}.svg`" />
            </td>
            <td>
              {{ specieDetailed.complete_name }}
            </td>
            <td>
              <v-chip
                v-for="impl in specieDetailed.implantation.split(' ; ')"
                :key="impl"
                color="primary"
                :small="!xSmall"
                :x-small="xSmall"
                class="mr-2"
              >
                {{ impl }}
              </v-chip>
            </td>
            <td>
              <input-quantity
                :index-type="specieDetailed.index"
                :quantity="specieDetailed.quantity"
              />
            </td>
            <td>
              {{ specieDetailed.yield_by_plank }}
            </td>
            <td>
              {{ (specieDetailed.yield_by_plank * specieDetailed.quantity).toFixed(2) }}
            </td>
            <td>
              {{ specieDetailed.quantity * 16 }}
            </td>
            <td>
              <v-btn
                icon
                x-small
                @click="removeSpecieDetailed(specieDetailed.index)"
              >
                <v-icon x-small>fas fa-trash</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import InputQuantity from '~/components/inputs/InputQuantity.vue'

export default {
  name: "DetailSpeciesTable",
  components: {InputQuantity},
  props: {
    xSmall: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      key: 0
    }
  },
  computed: {
    ...mapGetters({
      speciesDetailed: 'getSpeciesDetailed'
    })
  },
  methods: {
    deleteAllSpecies() {
      this.$router.push('/')
      this.$store.commit('deleteAllSpecies')
    },
    removeSpecieDetailed(indexSpecieDetailed) {
      this.$store.commit('removeSpecieDetailed', indexSpecieDetailed)
      this.key++
    }
  }
}
</script>
<style lang="scss" scoped>
.img_specie {
  width: 50px;
  height: 30px; 
}
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>