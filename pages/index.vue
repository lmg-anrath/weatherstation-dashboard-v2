<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken = 'pk.eyJ1IjoibWF4Ym94IiwiYSI6ImNpcWpubHVrZDAwZGZod2t4eGxxaHIybDkifQ.6SitTIIurXlwj3pVBeyhow';

const returns_selected = useReturnsSelected();
const stations_selected = useStationsSelected();
const stations_fetched = useStationsFetched();
const fetch_results = useFetchReslts();
const fetch_done = useFetchDone();
const data_display_show = useDataDisplayShow();
const time_start = useTimeStart();
const time_end = useTimeEnd();
const stations_selected_popups = useStationsSelectedPopups();

const fetch_data = async (start: number, end: number) => {
  fetch_done.value = false;
  await apidata(start, end, format_returns(returns_selected.value), stations_selected.value, fetch_results)
  for (let [station_id, data] of fetch_results.value.entries()) {
    const popup = stations_selected_popups.value.get(station_id);
    if (!popup) continue;
    const last_send = data.temperature[data.temperature.length - 1]?.time;
    let is_in_range = true;
    if (last_send) {
      is_in_range = in_past_hour(Math.round((new Date(last_send)).getTime()));
      if (!in_past_hour(time_end.value * 1000)) {
        continue;
      }
    } else {
      is_in_range = false;
    }
    let popup_text = `<p style="color: rgb(${stations_fetched.value[station_id].color});">[Id: ${station_id}]</p>Temperatur: ${data.temperature[data.temperature.length - 1]?.value}\u00B0C<br/>Luftfeuchtigkeit: ${data.humidity[data.humidity.length - 1]?.value}%<br/>Partikel [2.5]: ${data.air_particle_pm25[data.air_particle_pm25.length - 1]?.value}<br/>Partikel [10]: ${data.air_particle_pm10[data.air_particle_pm10.length - 1]?.value}<br/>Luftdruck: ${data.air_pressure[data.air_pressure.length - 1]?.value}hPa`;
    if (popup_text.includes('undefined') || !is_in_range) {
      popup_text = `<p style="color: rgb(${stations_fetched.value[station_id].color});">[Id: ${station_id}]</p>Derzeit außer Betrieb`;
    }
    popup.setHTML(popup_text);
  }
  fetch_done.value = true;
};

watch([time_start, time_end], () => {
  fetch_data(time_start.value, time_end.value);
});

onMounted(async () => {
  setTimeout(async () => {
    const now = Math.floor(Date.now() / 1000);
    fetch_data(now - times['Tag'], now);
  }, 1000);
});
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