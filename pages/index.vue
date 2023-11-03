<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4Ym94IiwiYSI6ImNpcWpubHVrZDAwZGZod2t4eGxxaHIybDkifQ.6SitTIIurXlwj3pVBeyhow';

const returns_selected = useReturnsSelected();
const stations_selected = useStationsSelected();
const fetch_done = useFetchDone();
const data_display_show = useDataDisplayShow();
const time_start = useTimeStart();
const time_end = useTimeEnd();

watch([time_start, time_end], () => {
  fetch_data(time_start.value, time_end.value);
});

let stations_old_length = 0;
watch(() => stations_selected.value, (stations_new: number[], stations_old: number[]) => {
    if (stations_old_length > stations_new.length) return;
    stations_old_length = stations_new.length;
    if (stations_new.length === 0) return;
    fetch_data(time_start.value, time_end.value);
  },
  {
    deep: true,
    flush: 'pre'
  }
);
</script>

<template>
  <div>
    <div class="absolute">
      <ControlPanel />
      <div class="main">
        <div class="main-content" :style="(!fetch_done) ? `height: ${630 - (returns_all.length - returns_selected.length) * 116}px;` : (data_display_show) ? `height: ${2030 - (returns_all.length - returns_selected.length) * 396}px;` : 'height: 50px;'">
          <div class="main-content-hide" @click="data_display_show = !data_display_show">
            <svg class="min" :style="(data_display_show) ? 'opacity: 1;' : 'opacity: 0;'" xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
            <svg class="max" :style="(data_display_show) ? 'opacity: 0;' : 'opacity: 1;'" xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          </div>
          <DataDisplay v-for="data in returns_selected">
            <h1>{{ translate_returns[data] }}</h1>
            <DataGraph v-if="fetch_done" :values="data"></DataGraph>
          </DataDisplay>
        </div>
      </div>
    </div>
    <BackgroundMap />
  </div>  
</template>