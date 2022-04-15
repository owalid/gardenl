<template>
  <div  class="d-flex flex-row ma-0 pa-0" align="baseline">
      <!-- decrement -->
      <v-icon
        class="ma-0 pa-0"
        x-small 
        @click="updateQuantity(quantity-1)"
      >
        fas fa-minus
      </v-icon>
      <div class="pt-0 mx-1" style="width: 45px;">
        <v-text-field
          :value="quantity"
          class="pt-0 mt-0 input-qty"
          hide-details
          single-line
          solo
          dense
          readonly
          flat
        ></v-text-field>
      </div>
      <!-- increment -->
      <v-icon
        class="ma-0 pa-0"
        x-small
        @click="updateQuantity(quantity+1)"
      >
        fas fa-plus
      </v-icon>
    </div>
</template>
<script>
import dataSpecies from '~/data/dataSpecies.json'
export default {
  name: "InputQuantity",
  props: {
    indexType: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dataSpecies
    }
  },
  methods: {
    updateQuantity(quantity) {

      const result = [];
      this.dataSpecies.forEach(specie => {
        specie.types.forEach(type => {
          if (type.quantity > 0) {
            result.push({
              index: type.index,
              quantity: type.quantity
            })
          }
        })
      })
      console.log("updateQuantity", quantity)
      console.log("indexType", this.indexType)
      this.$store.commit('updateQuantity', {
        index: this.indexType,
        quantity
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .compact-checkbox {
    transform: scale(0.85);
    transform-origin: left;

  }
</style>