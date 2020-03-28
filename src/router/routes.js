import appRoutes from './app.js';

const routes = [
  {
    path: '/',
    component: () => import('layouts/AppLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('pages/Index.vue'),
      },
    ].concat(appRoutes),
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
