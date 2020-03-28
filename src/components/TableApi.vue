<template>
  <q-table
    flat
    bordered
    class="q-px-md"
    ref="qTable"
    row-key="id"
    :data="table.data"
    :columns="table.columns"
    :filter="table.filter"
    :pagination.sync="table.pagination"
    :loading="table.loading"
    :visible-columns="visibleColumns"
    @request="request"
  >
    <template v-slot:top>
      <div class="full-width">
        <div class="row">
          <div class="col" >
            <q-input
              outlined
              v-model="table.filter"
            >
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>

          <div class="col text-right q-gutter-md">
            <q-btn
              v-if="isActionAvailable('add')"
              no-caps
              dense
              unelevated
              size="md"
              class="fa-14 q-px-sm"
              color="yellow-9"
              text-color="black"
              :label="addLabel"
              :icon="addIcon"
              @click="defaultAdd()"
            />

            <q-btn
              no-caps
              outline
              dense
              size="md"
              class="fa-14 q-px-sm outline-text-black btn-height"
              color="grey-5"
              icon="filter_list"
              >
              <q-menu>
                <q-card>
                  <q-card-section>
                    <div v-for="column in table.columns.filter(column => !column.required)" :key="column.name">
                      <q-toggle v-model="visibleColumns" :val="column.name" :label="column.label" />
                    </div>
                  </q-card-section>
                </q-card>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </template>

    <template
      v-slot:body-cell-row_actions="props"
    >
      <slot
        name="body-cell-row_actions"
        v-bind="props"
      >
      <q-td :props="props">
        <!-- Default q-td content -->
      </q-td>
      </slot>
    </template>

    <template
      v-slot:body-cell="props"
    >
      <slot
        :name="'body-cell-'+props.col.name"
        v-bind="props"
      >
        <q-td :props="props">
          {{ props.value }}
        </q-td>
      </slot>
    </template>
  </q-table>
</template>

<script>
export default {
  props: {
    table: {
      type: Object,
      default: () => null,
      required: true,
    },
    actions: {
      type: Array,
      default: () => [], // add
    },
    addLabel: {
      type: String,
      default: () => 'Add',
    },
    addIcon: {
      type: String,
      default: () => 'add',
    },
  },
  data() {
    return {
      visibleColumns: this.table.columns.map(column => column.name),
    };
  },
  methods: {
    request(props) {
      this.table.updateUrl(props, this.$router);
    },
    isActionAvailable(action) {
      const hasPermission = true;

      return hasPermission && this.actions.some(a => a === action);
    },
    defaultAdd() {
      // if there is an event handler for `add` we don't run the default add
      if (this.$listeners.add) {
        return this.$emit('add');
      }

      // this.$router.push({ name: `${this.getRoutePrefix}.add` });
    },
    defaultEdit(row) {
      // if there is an event handler for `edit` we don't run the default edit
      if (this.$listeners.edit) {
        return this.$emit('edit', row);
      }

      // this.$router.push({ name: `${this.getRoutePrefix}.edit`, params: { id: row.id } });
    },
  },
};
</script>

<style lang="scss">
.q-table__top {
  padding: 16px 0px;
}

.q-table th {
  font-weight: 700;
  background-color: #B0C1EF26;
}
</style>
