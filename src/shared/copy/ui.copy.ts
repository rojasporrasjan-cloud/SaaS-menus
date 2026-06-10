export const COPY = {
  search: {
    placeholder: 'Buscar platillo…',
    results: (n: number) => `${n} resultado${n !== 1 ? 's' : ''}`,
    noResults: 'Sin resultados para esta búsqueda',
    searching: 'Buscando…',
  },
  dish: {
    unavailable: 'Agotado',
    arBadge: 'AR',
    viewDetail: 'Ver detalle',
    addToOrder: 'Pedir',
  },
  table: {
    label: (n: string | number) => `Mesa ${n}`,
  },
  editor: {
    saveSuccess: 'Cambios guardados',
    saveError: 'Error al guardar. Intenta de nuevo.',
    publishSuccess: '¡Menú publicado!',
    publishError: 'Error al publicar. Intenta de nuevo.',
    unsavedChanges: 'Tienes cambios sin guardar',
    publishing: 'Publicando…',
    saving: 'Guardando…',
    undoSuccess: 'Cambio deshecho',
    noMoreUndo: 'No hay más cambios que deshacer',
  },
  auth: {
    signIn: 'Iniciar sesión',
    signOut: 'Cerrar sesión',
    loading: 'Cargando…',
    error: 'Error al iniciar sesión. Verifica tus credenciales.',
  },
  errors: {
    generic: 'Algo salió mal. Intenta de nuevo.',
    notFound: 'No encontrado.',
    unauthorized: 'No tienes permiso para hacer esto.',
    networkError: 'Error de conexión. Verifica tu internet.',
  },
  empty: {
    dishes: 'No hay platillos en esta categoría.',
    menu: 'Este menú está vacío.',
    search: 'No se encontraron resultados.',
  },
} as const
