<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  },
});

const time_start = useTimeStart();
const time_end = useTimeEnd();

const set_time_range = () => {
  const now = Math.floor(Date.now() / 1000);
  time_end.value = now;
  time_start.value = now - times[props.name];
};
</script>

<template>
  <div>
    <button @click="set_time_range">{{ name }}</button>
  </div>
</template>