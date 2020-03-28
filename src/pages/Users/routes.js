export default [
  {
    name: 'users.index',
    path: 'users',
    component: () => import('./Index.vue'),
  },
  {
    path: 'users/add',
    name: 'users.add',
    component: () => import('./UserForm.vue'),
  },
  {
    path: 'users/:id/edit',
    name: 'users.edit',
    component: () => import('./UserForm.vue'),
  },
];
