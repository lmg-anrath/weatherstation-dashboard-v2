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
  return useState('stations_selected', () => [0]);
};

export const useStationsSelectedMarkers = () => {
  return useState('stations_selected_markers', () => new Map());
};

export const useStationsSelectedPopups = () => {
  return useState('stations_selected_popups', () => new Map<number, mapboxgl.Popup>());
}

export const useReturnsSelected = () => {
  return useState('returns_selected', () => returns_all);
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