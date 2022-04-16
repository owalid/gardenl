import dataSpecies from '~/data/dataSpecies.json';


export const getters = {
  getPlanificationRaw(state, getters) {
    /*
      return object of array[n] of array[3] of objects
      n is size number of gardens or greenhouses
      3 is size of plank

      Example:
      {
        gardens: [ (size n)
          [ // plank 1 (size 3)
            {
              specie: '',
            }
            {
              specie: '',
            }
          ]
        ],
        greenhouse: []
      }
    */
   
    const res = {
      gardens: [],
      greenhouse: []
    }
    dataSpecies
        // filter by selected specie and get minimal data
        .map(specie => specie.types
                              .filter(type => state.speciesSelected.find(specieSelected => specieSelected.index === type.index))
                              .map(type => {
                                const result = []
                                const {quantity} = state.speciesSelected.find(specieSelected => specieSelected.index === type.index)
                                for (let i=0; i < quantity; i++) {
                                  result.push({
                                    index: type.index,
                                    month_start_recolte: type.month_start_recolte,
                                    month_end_recolte: type.month_end_recolte,
                                    month_start_semis: type.month_start_semis,
                                    month_end_semis: type.month_end_semis,
                                    specie_name: specie.specie_index,
                                    garden: type.garden
                                  })
                                }
                                return result;
                              }))
        .filter(types => types.length > 0)
        .map(types => {
          // dispatch for each array inside types by maximum 3 elements by array
          const result = []
          types.forEach((type, indexType) => {
            result[indexType] = []
            let i = 0
            while (i < type.length) {
              result[indexType].push(type.slice(i, i+3))
              i += 3
            }
          })
          return result.flat()
        }).flat()
        .forEach(plank => {
          // dispatch between garden and greenhouse
          if (plank[0].garden) {
            res.gardens.push(plank)
          } else {
            res.greenhouse.push(plank)
          }
        })
    return res
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
    this.$cookies.set('speciesSelected', state.speciesSelected)
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
    this.$cookies.set('speciesSelected', state.speciesSelected)
  }
}

export const actions = {
  nuxtServerInit({ state }, { req }) {
    if (req.headers.cookie) {
      const speciesSelected = this.$cookies.get('speciesSelected')
      state.speciesSelected = speciesSelected || [];
    }
  }
}