import isEmpty from 'lodash/isEmpty';

/**
 * This requires the following:
 * - table instance bound in data()
 */
export default {
  created() {
    if (this.table.shouldRequest(null, this.$route)) {
      // when browser is refreshed
      this.table.setRoute(this.$route).build().request();
    }
  },
  watch: {
    // when back, forward, and change in query params is triggered
    $route($before, $after) {
      this.table.setRoute(this.$route);

      if (this.$route.query.filter) {
        this.table.setFilter(this.$route.query.filter);
      }

      // re-build table props so it will reset to initial props when query params is empty
      // this will synchronize the url and the table state
      if (isEmpty(this.$route.query)) {
        this.table.build();
      }

      if (this.table.shouldRequest($before, $after)) {
        this.table.request();
      }
    },
  },
};
