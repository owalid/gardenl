<template>
  <v-container>
     <v-simple-table>
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(specieDetailed, idSpecieDetailed) in speciesDetailed" :key="idSpecieDetailed">
            <td>
              <img class="img_specie" :src="specieDetailed.img_specie" />
            </td>
            <td>
              {{ specieDetailed.complete_name }}
            </td>
            <td>
              <v-chip v-for="impl in specieDetailed.implantation.split(' ; ')" :key="impl" color="primary" small class="mr-2">
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
              {{ specieDetailed.yield_by_plank * specieDetailed.quantity }}
            </td>
            <td>
              {{ specieDetailed.quantity * 16 }}
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
  computed: {
    ...mapGetters({
      speciesDetailed: 'getSpeciesDetailed'
    })
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