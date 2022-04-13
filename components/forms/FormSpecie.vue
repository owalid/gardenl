<template>
  <v-container>
    <v-row align="center" justify="center">
      <h1 class="primary--text">Sélection des légumes</h1>
    </v-row>
    <v-row class="my-4">
      <v-text-field
        label="Recherche"
        append-icon="fas fa-magnifying-glass"
      >
        <template #append>
          <fa class="fas fa-magnifying-glass"></fa>
        </template>
      </v-text-field>
    </v-row>
    <v-row>
      <v-col v-for="(dataSpecie, indexSpecie) in dataSpecies" :key="indexSpecie" cols="3" >
        <div class="container_specie">
          <img :src="dataSpecie.src_img" width="200px" height="150px"/>
          <p class="my-2 text-center">{{ dataSpecie.specie }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import dataSpecies from '~/scrapper/dataSpecies.json'

export default {
  name: "FormSpecie",
  data() {
    return {
      dataSpecies
    }
  }
}
</script>
<style scoped>
.container_specie {
  border-radius: 12px;
  width: 200px;
  height: 200px;
  background: #F3F3F3;
}
</style>