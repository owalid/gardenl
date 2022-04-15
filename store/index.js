import dataSpecies from '~/data/dataSpecies.json';

export const getters = {
  getPlanificationRaw(state) {
    return ''
  },
  getPlanificationOptimized(state) {
    return ''
  },
  getSpeciesQuantity(state) {
    return dataSpecies.map((specie, indexSpecie) => 
      specie.types.map((type, indexType) => {
        const currentSelected = state.speciesSelected.find(specieSelected => specieSelected.index === type.index)
        return (currentSelected) ? currentSelected.quantity : 0;
      })
    )
  },
  getSpeciesDetailed(state, getters) {
    // bind speciesSelected with dataSpecies
    const result = [];
    const speciesQuantity = getters.getSpeciesQuantity
    dataSpecies
            .forEach((species, speciesIndex) => {
              const speciesFiltered = species.types
                                      .filter(type => state.speciesSelected
                                                      .findIndex(specieSelected => specieSelected.index === type.index) > -1)
                                      .map((type, typeIndex) => {
                                        const quantity  = speciesQuantity[speciesIndex][typeIndex]
                                        return {...type, quantity, img_specie: species.src_img}
                                      })
              if (speciesFiltered.length > 0) {
                result.push(...speciesFiltered)
              }
            });
    return result.sort((a, b) => a.family_name)
  },
  getTotalSpeciesSelected(state, getters) {
    const speciesDetailed = getters.getSpeciesDetailed

    const totalPlank = speciesDetailed.reduce((acc, cur) => acc + cur.quantity, 0)
    const etp = ((speciesDetailed.reduce((acc, cur) => acc + cur.it_duration, 0) + 376) / 1600).toFixed(2)
    const sumYield = parseInt(speciesDetailed.reduce((acc, cur) => acc + cur.yield_by_plank * cur.quantity, 0))
    const sumSurface = parseInt(speciesDetailed.reduce((acc, cur) => acc + cur.quantity * 16, 0))

    return {
      etp,
      sumYield,
      sumSurface,
      totalPlank
    }
  }
}

export const state = () => ({
  speciesSelected: [],
})

export const mutations = {
  setSpeciesSelected(state, species) {
    state.speciesSelected = species
  },
  updateQuantity(state, {index, quantity}) {
    if (quantity < 0) return ;

    let copySpeciesSelected = [...state.speciesSelected]
    if (quantity === 0) {
      copySpeciesSelected = copySpeciesSelected.filter(specieSelected => specieSelected.index !== index)
    } else {
        dataSpecies.forEach((specie, indexSpecie) => {
          specie.types.forEach((type, indexType) => {
          if (type.index === index) {
            const indexSpecieSelected = copySpeciesSelected.findIndex(specieSelected => specieSelected.index === index)
            if (indexSpecieSelected > -1) {
              copySpeciesSelected[indexSpecieSelected].quantity = quantity
            } else {
              copySpeciesSelected.push({index, quantity})
            }
          }
        })
      })
    }
    state.speciesSelected = [...copySpeciesSelected]
  }
}