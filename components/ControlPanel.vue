<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import mapboxgl from 'mapbox-gl';

const returns_selected = useReturnsSelected();
const stations_selected = useStationsSelected();
const stations_selected_markers = useStationsSelectedMarkers();
const stations_selected_popups = useStationsSelectedPopups();
const fetch_results = useFetchReslts();
const fetch_done = useFetchDone();
const stations_fetched = useStationsFetched();
const time_start = useTimeStart();
const time_end = useTimeEnd();

const date = ref(null);

const time_update = () => {
  setTimeout(() => {
    if (!date.value) return;
    const start = Math.floor(date.value[0] / 1000);
    const end = Math.floor(date.value[1] / 1000);
    time_start.value = start;
    time_end.value = end;
  }, 100);
}

const { data, error } = await stations();
if (error.value) {
  data.value = []
}
const stations_all: Station[] = (data.value as any[]).map((station: any) => ({
  name: station.name,
  position: station.position,
  color: station.color,
  active: station.active
}));
stations_fetched.value = stations_all;
let map: Ref<mapboxgl.Map>;
onMounted(() => {
  map = useMap();
  stations_selected.value = [];
  for (let i = 0; i < stations_all.length; i++) {
    if (!stations_all[i].active) continue;
    const popup = new mapboxgl.Popup().setText('Your text here');
    popup.addClassName('marker-popup');
    const marker = new mapboxgl.Marker({ color: `rgb(${stations_all[i].color})` })
      .setLngLat([stations_all[i].position.lon, stations_all[i].position.lat])
      .setPopup(popup)
      .addTo(map.value)
    stations_selected.value.push(i);
    stations_selected_markers.value.set(stations_all[i].name, marker);
    stations_selected_popups.value.set(i, popup);
  }
});
const button_selects = ['Tag', 'Woche'];
</script>

<template>
  <div class="control-panel">
    <div class="logo">
      <img src="/lmg.png" alt="">
    </div>
    <div class="control-returns">
      <div :class="`return-select-container${(!fetch_done && !in_returns(returns_selected, data)) ? ' button-disabled' : ''} ${(in_returns(returns_selected, data)) ? 'return-select-container-active' : ''}`" v-for="data, index in returns_all">
        <div class="return-select" @click="(in_returns(returns_selected, data)) ? remove_return(returns_selected, data) : add_return(returns_selected, data);">
          {{ translate_returns[data] }}
        </div>
      </div>
    </div>
    <div class="section-split"></div>
    <div class="control-stations" v-if="!error">
      <div class="station-select-container" v-for="data, index in stations_all" :style="(in_stations(stations_selected, index)) ? `background-color: rgba(${data.color}, 0.4);`: 'background-color: #0101011f;'">
        <div v-if="data.active" class="station-select" @click="(in_stations(stations_selected, index)) ? remove_station(stations_selected, stations_selected_markers, data.name, index, fetch_results) : add_station(stations_selected, stations_selected_markers, map, data.name, index, fetch_results)">
          <div class="station-select-name">{{ data.name }}</div>
        </div>
        <div v-if="data.active" class="station-select-goto" @click="zoom_to(stations_selected_markers, data.name, map)">
          <svg xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>
        </div>
      </div>
    </div>
    <div v-else>
      <h6>Error while fetching stations</h6>
    </div>
    <div class="datepicker-container">
      <div class="datepicker">
        <label>Time Range:</label>
        <VueDatePicker @update:model-value="time_update" v-model="date" placeholder="Select" :teleport="true" input-class-name="dp-input" menu-class-name="dp-menu" calendar-cell-class-name="dp-cell" dark range></VueDatePicker>
      </div>
      <div class="range-buttons">
        <div v-for="data in button_selects">
          <RangeButton :name="data"></RangeButton>
        </div>
      </div>
    </div>
  </div>
</template>