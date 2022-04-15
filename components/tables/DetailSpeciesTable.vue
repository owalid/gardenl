<template>
  <v-container>
    <pre>
      {{ speciesDetailed[0] }}
    </pre>
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
            <th>Surface</th>
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
              <v-row
                class="ml-4 my-0 py-0 compact-checkbox"
                align="baseline"
              >
              <!-- decrement -->
                <v-icon
                  class="my-0 py-0"
                  x-small 
                  @click="updateQuantity(idSpecieDetailed, specieDetailed.quantity-1)"
                >
                  fas fa-minus
                </v-icon>
                <div class="pt-0 mx-1" style="width: 45px;">
                  <!-- <v-text-field
                    :value="specieDetailed.quantity"
                    class="pt-0 mt-0 input-qty"
                    hide-details
                    single-line
                    solo
                    dense
                    readonly
                    flat
                  ></v-text-field> -->
                  {{ specieDetailed.quantity }}
                </div>

                <!-- increment -->
                <v-icon
                  class="my-0 py-0"
                  x-small
                  @click="updateQuantity(idSpecieDetailed, specieDetailed.quantity+1)"
                >
                  fas fa-plus
                </v-icon>
                </v-row>
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

export default {
  name: "DetailSpeciesTable",
  computed: {
    ...mapGetters({
      speciesDetailed: 'getSpeciesDetailed'
    })
  },
  methods: {
    updateQuantity(idSpecieDetailed, quantity) {
     console.log({
        idSpecieDetailed,
        quantity
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.img_specie {
  width: 50px;
  height: 30px; 
}

  .compact-checkbox {
    transform: scale(0.85);
    transform-origin: left;

  }
</style>