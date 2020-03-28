<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  meta: {
    title: process.env.APP_NAME,
  },
};
</script>
