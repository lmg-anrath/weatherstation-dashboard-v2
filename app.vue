<script setup lang="ts">
import '../assets/style.sass';

useSeoMeta({
  title: "Wetterstation LMG Dashboard",
  description: "Dashboard der Daten von den Wetterstationen der Wetterstations-AG am Lise-Meitner-Gymnasium Anrath"
});
useHead({
  htmlAttrs:{
    lang: 'de',
  }
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
