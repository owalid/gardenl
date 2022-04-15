<template>
  <v-container>
    <form-specie />
    <v-row
      align="end"
      justify="end"
      class="mt-7"
    >
      <v-btn
        color="primary"
        link
        :to="`/detail-varietes`"
        :disabled="speciesDetailed.length === 0"
      >
        Detail
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import FormSpecie from '~/components/forms/FormSpecie'

export default {
  name: 'IndexPage',
  components: {FormSpecie},
  computed: {
    ...mapGetters({
      speciesDetailed: 'getSpeciesDetailed'
    })
  }
}
</script>