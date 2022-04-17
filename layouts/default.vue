<template>
  <v-app dark>
    <navigation-bar/>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import NavigationBar from '~/components/navigation/NavigationBar'

export default {
  components: {NavigationBar}
}
</script>