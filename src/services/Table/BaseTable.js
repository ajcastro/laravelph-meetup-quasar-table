/* eslint-disable radix */
/* eslint-disable no-prototype-builtins */
import axios from 'axios';
import get from 'lodash/get';

export default class BaseTable {
  constructor({
    url, route, params, shouldRequest, transformRow, table,
  }) {
    /**
     * The api url for axios get request.
     * E.g.
     * api/users
     * api/answer_sheets
     */
    this.url = url;

    /**
     * The route name to update browser url by $route.push
     * Optional. Defaults to the current route
     * E.g.
     * users.index
     * answer_sheets.index
     */
    this.route = route;

    /**
     * Axios get params
     */
    this.params = params || (() => {});

    /**
     * Trigger table.request() on created if true
     */
    this.shouldRequest = shouldRequest || (() => true);

    if (transformRow) {
      this.transformRow = transformRow;
    }

    // Merge and build the table
    this.mergeTable(table).build();
  }

  mergeTable(table) {
    table = {
      ...this.init(),
      ...table,
    };

    Object.keys(table).forEach((key) => {
      // only bind table props once to prevent unwanted overwrite of props when re-building table props
      if (this[key]) {
        return;
      }
      this[key] = table[key];
    });

    return this;
  }

  /**
   * Build the table props
   */
  build() {
    const query = this.getQuery();

    // Re-build filter and pagination to sync with browser url query params
    this.filter = query.hasOwnProperty('filter') ? query.filter : this.filter;

    this.pagination = {
      sortBy: query.hasOwnProperty('sortBy') ? query.sortBy : this.pagination.sortBy,
      descending: query.hasOwnProperty('descending') ? this.toBool(query.descending) : this.pagination.descending, // make sure to cast boolean to avoid issues with string 'false'
      page: query.hasOwnProperty('page') ? query.page : this.pagination.page,
      rowsPerPage: query.hasOwnProperty('rowsPerPage') ? query.rowsPerPage : this.pagination.rowsPerPage,
      rowsNumber: query.hasOwnProperty('rowsNumber') ? query.rowsNumber : this.pagination.rowsNumber,
    };

    return this;
  }

  /**
   * Transform row
   */
  transformRow(row) {
    return row;
  }

  /**
   * Table initialization
   */
  init() {
    const defaults = this.initDefaults();
    const config = this.initConfig();
    config.pagination = { ...defaults.pagination, ...config.pagination };
    return { ...defaults, ...config };
  }

  /**
   * Table initialization defaults
   */
  initDefaults() {
    return {
      filter: '',
      loading: false,
      pagination: {
        sortBy: '',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },

      data: [],
      columns: [],
    };
  }

  /**
   * Table initialization config
   */
  initConfig() {
    return {};
  }

  /**
   * Update the browser url by the given props.
   *
   * @param {Object} props
   */
  updateUrl(propsFromTable, $router) {
    $router.push({
      name: this.route,
      query: this.makeQueryParams(propsFromTable),
    });
  }

  filterToParams(props, filterKey = 'filter') {
    const params = {};

    if (typeof props.filter === 'string') {
      params[filterKey] = props.filter;
      return params;
    }

    if (typeof props.filter === 'object') {
      return { ...props.filter };
    }

    return {};
  }

  /**
   * Make query params.
   *
   * @param {object} propsFromTable
   */
  makeQueryParams(propsFromTable) {
    return {
      ...this.filterToParams(propsFromTable, 'filter'),
      sortBy: propsFromTable.pagination.sortBy,
      descending: propsFromTable.pagination.descending,
      rowsPerPage: propsFromTable.pagination.rowsPerPage,
      page: propsFromTable.pagination.page,
    };
  }

  /**
   * Axios get request for the table.
   *
   * @param {object} props
   */
  axiosGet(props) {
    if (this.cancelToken) {
      this.cancelToken.cancel('Search is cancelled by another request.');
      this.cancelToken = null;
    }

    this.cancelToken = axios.CancelToken.source();

    return axios.get(this.url, {
      params: {
        per_page: props.pagination.rowsPerPage,
        page: props.pagination.page,
        sort_by: props.pagination.sortBy,
        descending: props.pagination.descending,
        ...this.filterToParams(props, 'search'),
        ...this.params(),
      },
      cancelToken: this.cancelToken.token,
    });
  }

  /**
   * Fetch the api and set the table and pagination props
   */
  request() {
    const props = this.getProps();

    this.loading = true;

    return this.axiosGet(props).then((res) => {
      this.pagination = props.pagination;
      this.pagination.rowsNumber = res.data.total;
      this.data = res.data.data.map(this.transformRow);
    }).finally(() => {
      this.loading = false;
      this.cancelToken = null;
    });
  }

  /**
   * Set $route param
   *
   * @param {$route} $route
   */
  setRoute($route) {
    this.$route = $route;
    return this;
  }

  /**
   * Set filter.
   *
   * @param {string} filter
   */
  setFilter(filter) {
    this.filter = filter || '';
    return this;
  }

  /**
   * Get the props of this table
   */
  getProps() {
    const query = this.getQuery();

    const props = {
      filter: query.hasOwnProperty('filter') ? query.filter : this.filter,
      pagination: {
        sortBy: query.hasOwnProperty('sortBy') ? query.sortBy : this.pagination.sortBy,
        descending: query.hasOwnProperty('descending') ? this.toBool(query.descending) : this.pagination.descending,
        page: query.hasOwnProperty('page') ? parseInt(query.page) : this.pagination.page,
        rowsPerPage: query.hasOwnProperty('rowsPerPage') ? parseInt(query.rowsPerPage) : this.pagination.rowsPerPage,
        rowsNumber: query.hasOwnProperty('rowsNumber') ? parseInt(query.rowsNumber) : this.pagination.rowsNumber,
      },
    };

    return props;
  }

  /**
   * Get query params
   */
  getQuery() {
    return get(this, '$route.query', {});
  }

  /**
   * Make sure to cast to boolean
   *
   * @param {mixed} bool
   */
  toBool(bool) {
    return bool === 'false' ? false : !!bool;
  }
}
