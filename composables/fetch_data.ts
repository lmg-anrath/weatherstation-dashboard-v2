import type mapboxgl from "mapbox-gl";

export const returns_all = ['temperature', 'humidity', 'air_particle_pm25', 'air_particle_pm10', 'air_pressure'];

export type Position = {
  lat: number;
  lon: number;
};
export type Station = {
  name: string;
  position: Position;
  color: string;
  active: boolean;
};

export const useStationsFetched = () => {
  return useState('stations_fetched', () => [] as Station[]);
};

export interface ApiData {
  temperature:       DataSet[];
  humidity:          DataSet[];
  air_pressure:      DataSet[];
  air_particle_pm25: DataSet[];
  air_particle_pm10: DataSet[];
  hidden: boolean;
  [key: string]: DataSet[] | boolean;
};

export interface DataSet {
  time:  Date;
  value: number;
};

export const stations = () => {
  return useFetch('https://api.wetterstation-lmg.de/v2/stations');
};

export const useStationsSelected = () => {
  return useState('stations_selected', () => new Array<number>());
};

export const useStationsSelectedMarkers = () => {
  return useState('stations_selected_markerss', () => new Map());
};

export const useStationsSelectedPopups = () => {
  return useState('stations_selected_popups', () => new Map<number, mapboxgl.Popup>());
}

export const useReturnsSelected = () => {
  return useState('returns_selected', () => ['temperature', 'humidity', 'air_particle_pm25', 'air_particle_pm10', 'air_pressure']);
};

export const useFetchReslts = () => {
  return useState('fetch_results', () => new Map<number, ApiData>());
};

export const useFetchDone = () => {
  return useState('fetch_done', () => false);
};

export const apidata = async (time_start: number, time_end: number, returns: string, stations_selected: Array<number>, results: Ref<Map<number, ApiData>>) => {
  for (let i = 0; i < stations_selected.length; i++) {
    const station = stations_selected[i];
    const { data } = await useFetch(`https://api.wetterstation-lmg.de/v2/stations/${station}?start=${time_start}&end=${time_end}&channels=${returns}`);
    await data.value;
    results.value.set(station, (await data.value) as ApiData);
  }
};

export const fetch_data = async (start: number, end: number) => {
  const returns_selected = useReturnsSelected();
  const stations_selected = useStationsSelected();
  const stations_fetched = useStationsFetched();
  const fetch_results = useFetchReslts();
  const fetch_done = useFetchDone();
  const time_end = useTimeEnd();
  const stations_selected_popups = useStationsSelectedPopups();
  fetch_done.value = false;
  await apidata(start, end, format_returns(returns_selected.value), stations_selected.value, fetch_results)
  for (let [station_id, data] of fetch_results.value.entries()) {
    if (Object.keys(data).length != 5) break;
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
      popup.setHTML(`<p style="color: rgb(${stations_fetched.value[station_id].color});">[Id: ${station_id}]</p>Derzeit außer Betrieb`);
      continue;
    }
    let popup_text = `<p style="color: rgb(${stations_fetched.value[station_id].color});">[Id: ${station_id}]</p>Temperatur: ${data.temperature[data.temperature.length - 1]?.value}\u00B0C<br/>Luftfeuchtigkeit: ${data.humidity[data.humidity.length - 1]?.value}%<br/>Partikel [2.5]: ${data.air_particle_pm25[data.air_particle_pm25.length - 1]?.value}<br/>Partikel [10]: ${data.air_particle_pm10[data.air_particle_pm10.length - 1]?.value}<br/>Luftdruck: ${data.air_pressure[data.air_pressure.length - 1]?.value}hPa`;
    if (popup_text.includes('undefined') || !is_in_range) {
      popup_text = `<p style="color: rgb(${stations_fetched.value[station_id].color});">[Id: ${station_id}]</p>Derzeit außer Betrieb`;
    }
    popup.setHTML(popup_text);
  }
  fetch_done.value = true;
};