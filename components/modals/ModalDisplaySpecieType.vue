<template>
  <v-dialog v-model="is_open" max-width="840">
    <v-card class="pa-6">
      <v-container>
        <v-row justify="center" class="mb-8">
          <h2 class="primary--text">Fiche variété</h2>
        </v-row>
        <v-row align="center">
          <v-col>
            <v-img class="image-specie-type" :src="dataSpecieType.src_img"></v-img>
          </v-col>
          <v-col cols="9">
            <p class="secondary--text body-1">
              {{ dataSpecieType.complete_name }}
              <br>
              <span class="font-italic font-weight-regular body-2">
                {{ dataSpecieType.latin_name }}
              </span>
            </p>
            <p class="body-2">
              {{ dataSpecieType.description }}
            </p>
          </v-col>
        </v-row>
        <v-row class="mt-10">
          <v-col>
            <v-row justify="center">
              <v-img contain class="icon-img" src="icons/graine.svg"></v-img>
            </v-row>
            <v-row justify="center">
              <p>Culture</p>
            </v-row>
            <v-row justify="center">
              <p class="caption">
                {{ dataSpecieType.culture }}
              </p>
            </v-row>
          </v-col>
          <v-col>
            <v-row justify="center">
              <v-img contain class="icon-img" src="icons/spacing.svg"></v-img>
            </v-row>
            <v-row justify="center">
              <p>Espacement</p>
            </v-row>
            <v-row justify="center">
              {{ dataSpecieType.spacing }}
            </v-row>
          </v-col>
          <v-col>
            <v-row justify="center">
              <v-img contain class="icon-img" src="icons/power.svg"></v-img>
            </v-row>
            <v-row justify="center">
              <p>Fertilisation</p>
            </v-row>
            <v-row justify="center">
              {{ dataSpecieType.fertilization }}
            </v-row>
          </v-col>
          <v-col>
            <v-row justify="center">
              <v-img contain class="icon-img" src="icons/water.svg"></v-img>
            </v-row>
            <v-row justify="center">
              <p>Irrigation</p>
            </v-row>
             <v-row justify="center">
              {{ dataSpecieType.irrigation }}
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mr-2 mt-10" justify="end">
          <v-btn
            class="pb-2" plain small color="primary"
            @click="is_open = false"
          >
            Fermer
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "ModalDisplaySpecieType",
  props: {
    dataSpecieType: {
      type: Object,
      required: true
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentToggleIndexType: -1,
      is_open: this.open
    }
  },
  watch: {
     is_open(newValue) {
        if (!newValue) {
          this.$emit('modalClose')
        }
      },
      open(newValue) {
        this.is_open = newValue
        if (!newValue) {
          this.$emit('modalClose')
        }
      }
  }
}
</script>
<style lang="scss" scoped>
.modal-select-specie-type {
  max-width: 640px;
}

.cursor-pointer {
  cursor: pointer;
}

.image-specie-type {
   border-radius: 50%;
   width: 150px;
   height: 150px;
}

.icon-img {
  width: 30px;
  height: 30px;
}
</style>