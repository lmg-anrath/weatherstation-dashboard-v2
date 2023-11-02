export const in_past_hour = (timestamp: number) => {
  const now = new Date();
  const one_hour_ago = new Date(now.getTime() - 60 * 60 * 1000);
  const timestamp_date = new Date(timestamp);
  return timestamp_date >= one_hour_ago;
};