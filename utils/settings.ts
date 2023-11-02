import type mapboxgl from "mapbox-gl";

export const in_stations = (stations_selected: number[], station_id: number) => {
  return stations_selected.indexOf(station_id) !== -1;
};

export const add_station = (stations_selected: number[], stations_selected_markers: Map<string, mapboxgl.Marker>, map: mapboxgl.Map, station_name: string, station_id: number, fetch_results: Map<number, ApiData>) => {
  const fetch_done = useFetchDone();
  const hidden = fetch_results.get(station_id);
  if (hidden != undefined) {
    if (hidden.temperature.length > 0) {
      fetch_done.value = false;
      hidden.hidden = false;
    }
  }
  fetch_results.set(station_id, hidden as ApiData)
  setTimeout(() => {
    fetch_done.value = true;
  }, 100);
  if (stations_selected.includes(station_id)) return;
  stations_selected.push(station_id);
  stations_selected_markers.get(station_name)?.addTo(map);
};

export const zoom_to = (stations_selected_markers: Map<string, mapboxgl.Marker>, station_id: string, map: mapboxgl.Map) => {
  const marker = stations_selected_markers.get(station_id);
  const data_display_show = useDataDisplayShow();
  data_display_show.value = false;
  if (!marker) return;
  map.flyTo({
    center: marker.getLngLat(),
    zoom: 10
  });
};

export const remove_station = (stations_selected: number[], stations_selected_markers: Map<string, mapboxgl.Marker>, station_name: string, station_id: number, fetch_results: Map<number, ApiData>) => {
  if (!stations_selected.includes(station_id)) return;
  const index = stations_selected.indexOf(station_id);
  if (index === -1) return;
  stations_selected.splice(index, 1);
  const fetch_done = useFetchDone();
  const hidden = fetch_results.get(station_id);
  if (hidden != undefined) {
    if (hidden.temperature.length > 0) {
      fetch_done.value = false;
      hidden.hidden = true;
    }
  }
  fetch_results.set(station_id, hidden as ApiData)
  stations_selected_markers.get(station_name)?.remove();
  setTimeout(() => {
    fetch_done.value = true;
  }, 100);
};

export const in_returns = (returns_selected: string[], return_name: string) => {
  return returns_selected.indexOf(return_name) !== -1;
}

export const add_return = async (returns_selected: string[], return_name: string) => {
  if (returns_selected.includes(return_name)) return;
  const fetch_done = useFetchDone();
  fetch_done.value = false;
  returns_selected.push(return_name);
  const fetch_results = useFetchReslts();
  let return_name_exists = false;
  for (let [key, value] of fetch_results.value.entries()) {
    if (value.hasOwnProperty(return_name)) {
      return_name_exists = true;
      break;
    }
  }
  if (return_name_exists) {
    fetch_done.value = true;
    return;
  }
  const time_start = useTimeStart();
  const time_end = useTimeEnd();
  const stations_selected = useStationsSelected();
  await apidata(time_start.value, time_end.value, format_returns(returns_selected), stations_selected.value, fetch_results);
  fetch_done.value = true;
};

export const remove_return = (returns_selected: string[], return_name: string) => {
  if (!returns_selected.includes(return_name)) return;
  const index = returns_selected.indexOf(return_name);
  if (index === -1) return;
  returns_selected.splice(index, 1);
};