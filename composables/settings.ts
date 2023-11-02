export const useDataDisplayShow = () => {
  return useState('data_display_show', () => true);
};

export const useTimeStart = () => {
  return useState('time_start', () => (Math.floor(Date.now() / 1000)) - 700 * 60);
};

export const useTimeEnd = () => {
  return useState('time_end', () => Math.floor(Date.now() / 1000));
};