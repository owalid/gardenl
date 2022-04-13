<template>
  <v-container>
    <v-row align="center" justify="center">
      <h1 class="primary--text">Sélection des légumes</h1>
    </v-row>
    <v-row class="my-4">
      <v-text-field
        v-model="textSearch"
        label="Recherche"
      >
        <template #append>
           <v-icon>fas fa-magnifying-glass</v-icon>
        </template>
      </v-text-field>
    </v-row>
    <v-row class="mx-10">
      <v-col
        v-for="(dataSpecie, indexSpecie) in dataSpeciesFiltered"
        :key="indexSpecie"
        cols="4"
        md="3"
      >
        <v-row justify="center" class="my-2">
          <modal-display-specieType
            v-if="indexShowSpecieType !== -1"
            :data-specie-type="dataSpeciesFiltered[indexShowSpecie].types[indexShowSpecieType]"
            :open="indexSpecie === indexShowSpecie"
            @modalClose="indexShowSpecieType = -1"
          />
          <div
            class="container-specie"
            :class="{'container-specie-hover': indexSpecie === currentOver}"
            @mouseenter="hoverSpecie(indexSpecie)"
            @mouseleave="unhoverSpecie"
            @click="updateIndexShowSpecie(indexSpecie)"
          >
            <img class="img_specie" :src="dataSpecie.src_img" />
            <p class="my-2 text-center">{{ dataSpecie.specie }}</p>
          </div>
          <div v-if="indexSpecie === indexShowSpecie" class="container-type">
            <v-row justify="center" class="pt-7 mb-8">
              <h2 class="primary--text">Sélection des variétés</h2>
            </v-row>
            <v-row class="ml-4">
              <p>{{dataSpecie.types.length}} variétés de {{ dataSpecie.specie }}</p>
            </v-row>
            <v-row
              v-for="(type, indexType) in dataSpecie.types"
              :key="indexType"
              class="ml-4 my-0 py-0 compact-checkbox"
            >
              <v-switch                
                v-model="tmp"
                :label="type.complete_name"
                hide-details
              >
              </v-switch>
            <v-icon
              small
              class="ml-2 mt-5 cursor-pointer"
              @click="indexShowSpecieType = indexType"
            >
              fa-question-circle
            </v-icon>
            </v-row>
            <v-row class="pb-7 mr-2 mt-3" justify="end">
              <v-btn class="pb-2" plain small color="primary">
                Valider <v-icon small class="ml-1">fas fa-chevron-right</v-icon>
              </v-btn>
            </v-row>
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
import dataSpecies from '~/data/dataSpecies.json'
import ModalDisplaySpecieType from '~/components/modals/ModalDisplaySpecieType'

export default {
  name: "FormSpecie",
  // eslint-disable-next-line vue/no-unused-components
  components: {ModalDisplaySpecieType},
  data() {
    return {
      tmp: false,
      checkbox: false,
      indexShowSpecie: -1,
      indexShowSpecieType: -1,
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
          return type.complete_name.toLowerCase().includes(this.textSearch.toLowerCase())
        })
      })

      return result;
    }
  },
  methods: {
    updateIndexShowSpecie(indexSpecie) {
      if (this.indexShowSpecie === indexSpecie) {
        this.indexShowSpecie = -1
      } else {
        this.indexShowSpecie = indexSpecie
      }
    },
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

 .container-type {
    width: 350px;
    height: auto;
    border-radius: 12px;
    position: absolute;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.199);
    z-index: 12;
    margin-top: 210px;
  }

  .compact-checkbox {
    transform: scale(0.85);
    transform-origin: left;
  }
</style>