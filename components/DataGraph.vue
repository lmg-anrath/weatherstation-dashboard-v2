<script setup lang="ts">
import { BarElement, CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, TimeScale, TimeSeriesScale, Title, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'vue-chartjs';
Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale);

const props = defineProps({
  values: {
    type: String,
    default: "temperature",
    required: true
  }
});

const fetch_results = useFetchReslts();
const stations_selected = useStationsSelected();
const stations_fetched = useStationsFetched();

const datasets = ref({
  'datasets': []
});
const chart = ref(null);
const mounted = ref(false);

for (let i = 0; i < stations_selected.value.length; i++) {
  const station_id = stations_selected.value[i];
  const station_data = fetch_results.value.get(station_id);
  if (!station_data) continue;
  const station_name = stations_fetched.value[station_id]['name'];
  const station_result = fetch_results.value.get(station_id);
  if (!station_result) continue;
  const odata = station_result[props.values];
  const tdata = (odata as DataSet[]).map((item: any) => {
    const time = new Date(item.time);
    time.setSeconds(0, 0);
    return {
      x: time,
      y: item.value
    };
  });
  const dataset = {
    "label": station_name,
    "backgroundColor": `rgb(${stations_fetched.value[station_id].color})`,
    "color": `rgb(${stations_fetched.value[station_id].color})`,
    "borderColor": `rgb(${stations_fetched.value[station_id].color})`,
    "data": tdata,
    "cubicInterpolationMode": "monotone"
  }
  
  if (fetch_results.value.get(station_id)?.hidden)
    dataset.data = [];
  // @ts-ignore
  datasets.value.datasets.push(dataset);
}

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div id="graph" :style="(!mounted) ? 'height: 0px;' : 'height: 250px;'">
    <Line
      ref="chart"
      :options="options(props.values)"
      :data="datasets"
      :class="'chart'"
    />
  </div>
</template>