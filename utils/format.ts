type TranslateReturns = {
  temperature: string;
  humidity: string;
  air_pressure: string;
  air_particle_pm25: string;
  air_particle_pm10: string;
  [key: string]: string;
};

export const translate_returns: TranslateReturns = {
  'temperature': 'Temperatur',
  'humidity': 'Luftfeuchtigkeit',
  'air_pressure': 'Luftdruck',
  'air_particle_pm25': 'Partikel [2.5]',
  'air_particle_pm10': 'Partikel [10]'
};

export type Time = {
  [key: string]: number;
};

export const times: Time = {
  'Tag': 86000,
  'Woche': 604800,
  'Monat': 2592000,
  'Jahr': 31536000
};

export const format_returns = (returns_selected: string[]) => {
  let returns_encoded = '';
  for (let i = 0; i < returns_selected.length; i++) {
    returns_encoded += (i == returns_selected.length - 1) ? returns_selected[i] : returns_selected[i]  + "%2C";
  }
  return returns_encoded;
};