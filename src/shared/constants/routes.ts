export const ROUTES = {
  /* ── Marketing / acquisition (público, sin auth) ── */
  marketing: {
    landing: '/',
    templates: '/plantillas',
    quote: '/cotizar',
  },

  /* ── Public (customer-facing QR views) ── */
  public: {
    menu: '/:tenantId/menu',
    dish: '/:tenantId/menu/:menuId/dish/:dishId',
    notFound: '/404',
  },

  /* ── Admin dashboard ── */
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    editor: '/admin/editor',
    menu: {
      list: '/admin/menu',
      editor: '/admin/menu/:menuId',
    },
    dishes: {
      list: '/admin/dishes',
      editor: '/admin/dishes/:dishId',
      new: '/admin/dishes/new',
    },
    qr: '/admin/qr',
    templates: '/admin/templates',
    appearance: '/admin/appearance',
    analytics: '/admin/analytics',
    settings: '/admin/settings',
  },

  /* ── Auth ── */
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
} as const
