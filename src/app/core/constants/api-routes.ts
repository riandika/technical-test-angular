export const API_ROUTES = {
  users: {
    byEmail: '/users/filter',
  },
  auth: {
    login: '/auth/login',
  },
  products: {
    list: '/products',
    details: (id: number) => `/products/${id}`,
  },
} as const;
