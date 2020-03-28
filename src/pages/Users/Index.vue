<template>
  <q-page class="q-py-md q-px-xl">
    <div class="page-title">
      Users
    </div>

    <div class="q-mt-lg">
      <UsersTable />
    </div>
  </q-page>
</template>

<script>
import UsersTable from './UsersTable.vue';

export default {
  components: {
    UsersTable,
  },
  data() {
    return {
    };
  },
};
</script>
