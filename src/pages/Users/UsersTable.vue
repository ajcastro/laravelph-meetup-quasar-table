<template>
  <div>
    <table-api
      :table="table"
      add-label="New"
      :actions="['add']"
      @add="$router.push({ name: 'users.add' })"
    >
      <template
        v-slot:body-cell-avatar="props"
        >
        <q-td :props="props">
          <q-img
            :src="props.row.avatar_url || props.row.avatar"
            style="width: 50px;"
            class=""
          >
            <template v-slot:error>
              <q-icon name="fa fa-camera" class="q-ma-sm" />
            </template>
          </q-img>
        </q-td>
      </template>

      <template
        v-slot:body-cell-row_actions="props"
        >
        <q-td :props="props">
          <q-btn
            align="around"
            icon="more_vert"
            dense unelevated
            color="white"
            text-color="yellow-9"
            class="q-ma-xs"
            size="sm"
            >
            <q-menu>
              <q-list class="bg-grey-8" dark>
                <q-item
                  dense
                  clickable
                  v-close-popup
                  @click="edit(props.row)"
                >
                  <q-item-section>
                    Edit
                  </q-item-section>
                </q-item>
                <q-separator dark/>
                <q-item
                  dense
                  clickable
                  v-close-popup
                  @click="edit(props.row)"
                >
                  <q-item-section>
                    Details
                  </q-item-section>
                </q-item>
                <q-separator dark/>
                <q-item
                  dense
                  clickable
                  v-close-popup
                  @click="deleteRow(props.row)"
                >
                  <q-item-section>
                    Delete
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </table-api>

  </div>
</template>

<script>
import TableApi from 'components/TableApi';
import tableHooks from 'src/services/Table/tableHooks';
import BaseTable from 'src/services/Table/BaseTable.js';

export default {
  components: {
    TableApi,
  },
  mixins: [
    tableHooks,
  ],
  data() {
    return {
      table: new BaseTable({
        url: 'api/v1/admin/app_users',
        table: this.tableConfig(),
      }),
    };
  },
  methods: {
    tableConfig() {
      return {
        visibleColumns: [],
        columns: [
          {
            name: 'row_number',
            required: true,
            label: '#',
            align: 'right',
            field: 'row_number',
            sortable: false,
          },
          {
            name: 'id',
            required: true,
            label: 'ID',
            align: 'left',
            field: 'id',
            sortable: true,
          },
          {
            name: 'name',
            required: true,
            label: 'Name',
            align: 'left',
            field: 'name',
            sortable: true,
          },
          {
            name: 'email',
            required: false,
            label: 'Email',
            align: 'left',
            field: 'email',
            sortable: true,
          },
          {
            name: 'avatar',
            required: false,
            label: 'Avatar',
            align: 'left',
            field: 'avatar',
            sortable: false,
          },
          {
            name: 'company_name',
            required: false,
            label: 'Company',
            align: 'left',
            field: row => (row.company ? row.company.name : ''),
            sortable: true,
          },
          {
            name: 'created_at',
            required: false,
            label: 'Created At',
            align: 'left',
            field: 'created_at_display',
            sortable: true,
          },
          {
            name: 'row_actions',
            required: true,
            label: 'Action',
            align: 'right',
            field: '',
            sortable: false,
          },
        ],
      };
    },
    edit(row) {
      this.$router.push({ name: 'users.edit', params: { id: row.id } });
    },
    deleteRow(row) {
      this.$confirm('Are you sure to delete this user?').onOk(() => {
        this.$axios.delete(`${this.table.url}/${row.id}`).then(() => {
          this.$notify.success('User is succesfully deleted.');
          this.table.request();
        });
      });
    },
  },
};
</script>
