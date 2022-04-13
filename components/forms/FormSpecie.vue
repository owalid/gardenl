<template>
  <v-container>
    <v-row align="center" justify="center">
      <h1 class="primary--text">Sélection des légumes</h1>
    </v-row>
    <!-- <pre>
      {{ dataSpeciesFiltered }}
    </pre> -->
    <v-row class="my-4">
      <v-text-field
        v-model="textSearch"
        label="Recherche"
        append-icon="fas fa-magnifying-glass"
      >
        <template #append>
          <fa class="fas fa-magnifying-glass"></fa>
        </template>
      </v-text-field>
    </v-row>
    <v-row>
      <v-col
        v-for="(dataSpecie, indexSpecie) in dataSpeciesFiltered"
        :key="indexSpecie"
        cols="4"
        md="3"
      >
      <v-row justify="center" class="my-2">
        <div
          class="container-specie"
          :class="{'container-specie-hover': indexSpecie === currentOver}"
          @mouseenter="hoverSpecie(indexSpecie)"
          @mouseleave="unhoverSpecie"
        >
          <img class="img_specie" :src="dataSpecie.src_img" />
          <p class="my-2 text-center">{{ dataSpecie.specie }}</p>
        </div>
        </v-row>
      </v-col>
    </v-row>
    <v-row align="end" justify="end" class="mt-7">
      <v-btn color="primary">
        Suivant
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import dataSpecies from '~/scrapper/dataSpecies.json'

export default {
  name: "FormSpecie",
  data() {
    return {
      dataSpecies,
      textSearch: '',
      currentOver: -1
    }
  },
  computed: {
    dataSpeciesFiltered() {
      if (!this.textSearch) {
        return this.dataSpecies
      }
      const result = this.dataSpecies.filter(specie => {
        return specie.specie.toLowerCase().includes(this.textSearch.toLowerCase()) || specie.types.find(type => {
          return type.complete_name.toLowerCase().includes(this.textSearch.toLowerCase()) || type.description.toLowerCase().includes(this.textSearch.toLowerCase())
        })
      })

      return result;
    }
  },
  methods: {
    hoverSpecie(indexSpecie) {
      this.currentOver = indexSpecie
    },
    unhoverSpecie() {
      this.currentOver = -1
    }
  }
}
</script>
<style scoped lang="scss">
.container-specie {
  &-hover {
    opacity: 0.7;
  }
  cursor: pointer;
  border-radius: 12px;
  width: 150px;
  height: 150px;
  background: #F3F3F3;

  .img_specie {
    width: 150px;
    height: 100px; 
  }
}

@media (max-width: 425px) {
  .container-specie {
    width: 100px;
    height: 100px;

    .img_specie {
      width: 100px;
      height: 50px; 
    }
  }
}

@media (min-width: 768px) {
  .container-specie {
    width: 200px;
    height: 200px;

    .img_specie {
      width: 200px;
      height: 150px; 
    }
  }
}
</style>