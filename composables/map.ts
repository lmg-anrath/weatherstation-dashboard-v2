import mapboxgl from "mapbox-gl";

export const useMap = () => {
  return useState('map', () => new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/dark-v11",
    center: [10.811430344165391, 48.43828636950573],
    zoom: 5.5,
    antialias: true
  }));
}