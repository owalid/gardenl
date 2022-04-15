import dataSpecies from '~/data/dataSpecies.json';

export const getters = {
  getPlanificationRaw(state) {
    return ''
  },
  getPlanificationOptimized(state) {
    return ''
  },
  getSpeciesDetailed(state) {
    // bind speciesSelected with dataSpecies
    return dataSpecies.map(species => species.types.filter(type => state.speciesSelected.findIndex(specieSelected => specieSelected.index === type.index) > -1));
  }
}

export const state = () => ({
  speciesSelected: null,
})

export const mutations = {
  setSpeciesSelected(state, species) {
    state.speciesSelected = species
  }
}