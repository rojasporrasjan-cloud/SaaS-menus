export const categoriesData = [
  {
    name: "Sándwiches",
    slug: "sandwiches",
    sortOrder: 1,
    description: "Deliciosos sándwiches arreglados (Agréguele papitas por ₡500)"
  },
  {
    name: "Empanadas",
    slug: "empanadas",
    sortOrder: 2,
    description: "Empanadas caseras recién hechas"
  },
  {
    name: "Platos Fuertes",
    slug: "platos-fuertes",
    sortOrder: 3,
    description: "Platos completos con diferentes tipos de guarnición todos los días"
  },
  {
    name: "Pollo Frito y Más",
    slug: "pollo-frito",
    sortOrder: 4,
    description: "Crujiente pollo frito y alitas"
  },
  {
    name: "Hamburguesas",
    slug: "hamburguesas",
    sortOrder: 5,
    description: "Hamburguesas a la parrilla (Agréguele papitas por ₡500)"
  },
  {
    name: "Casados",
    slug: "casados",
    sortOrder: 6,
    description: "De lunes a viernes con fresco natural incluido"
  },
  {
    name: "Menú para Niños",
    slug: "ninos",
    sortOrder: 7,
    description: "Opciones infantiles especiales"
  },
  {
    name: "Tacos y Especialidades",
    slug: "tacos",
    sortOrder: 8,
    description: "Nuestros famosos tacos y creaciones exclusivas"
  },
  {
    name: "Porciones y Extras",
    slug: "extras",
    sortOrder: 9,
    description: "Acompañamientos y bocas para compartir"
  },
  {
    name: "Bebidas",
    slug: "bebidas",
    sortOrder: 10,
    description: "Refrescos y batidos"
  }
];

export const dishesData = [
  // Sándwiches
  { name: "Sándwich de carne", price: 2500, categorySlug: "sandwiches" },
  { name: "Sándwich de jamón y queso", price: 2500, categorySlug: "sandwiches" },
  { name: "Sándwich Especial", price: 3000, categorySlug: "sandwiches" },
  { name: "Sándwich de pechuga a la plancha", price: 3000, categorySlug: "sandwiches" },
  { name: "Sándwich de pechuga empanizada", price: 3000, categorySlug: "sandwiches" },
  
  // Empanadas
  { name: "Empanada de carne o pollo", price: 1200, categorySlug: "empanadas" },
  { name: "Empanada de queso o frijol", price: 1200, categorySlug: "empanadas" },
  { name: "Empanada Arreglada", price: 1600, categorySlug: "empanadas" },
  
  // Platos Fuertes
  { name: "Filete de pescado", price: 3800, categorySlug: "platos-fuertes" },
  { name: "Fajitas de pescado", price: 3800, categorySlug: "platos-fuertes" },
  { name: "Camarones empanizados con papas y ensalada", price: 4500, categorySlug: "platos-fuertes" },
  { name: "Bistec", price: 3700, categorySlug: "platos-fuertes" },
  { name: "Bistec con arroz", price: 4000, categorySlug: "platos-fuertes" },
  { name: "Pechuga de pollo a la plancha", price: 3500, categorySlug: "platos-fuertes" },
  { name: "Chop suey", price: 3000, categorySlug: "platos-fuertes" },
  { name: "Cordon bleu", price: 3500, categorySlug: "platos-fuertes" },
  { name: "Costilla de cerdo en BBQ", price: 3500, categorySlug: "platos-fuertes" },
  { name: "Lomito de cerdo a la plancha", price: 3500, categorySlug: "platos-fuertes" },
  { name: "Gallo pinto con huevos o natilla", price: 2200, categorySlug: "platos-fuertes" },
  { name: "Gallo pinto con carne, huevos o salchichón", price: 2800, categorySlug: "platos-fuertes" },

  // Pollo Frito y Más
  { name: "Pollo Frito Entero", price: 8500, categorySlug: "pollo-frito" },
  { name: "Pollo Frito Medio", price: 4250, categorySlug: "pollo-frito" },
  { name: "Pollo Frito Porción sencilla", price: 1500, categorySlug: "pollo-frito" },
  { name: "Pollo Frito Entero con papas grandes", price: 10500, categorySlug: "pollo-frito" },
  { name: "Pollo Frito Medio con papas", price: 5500, categorySlug: "pollo-frito" },
  { name: "Canasta", price: 2800, categorySlug: "pollo-frito" },
  { name: "Alitas BBQ (6)", price: 2800, categorySlug: "pollo-frito" },

  // Hamburguesas
  { name: "Hamburguesa Sencilla", price: 1800, categorySlug: "hamburguesas" },
  { name: "Hamburguesa con queso", price: 2000, categorySlug: "hamburguesas" },
  { name: "Hamburguesa Doble", price: 3000, categorySlug: "hamburguesas" },
  { name: "Hamburguesa de pechuga de pollo", price: 2500, categorySlug: "hamburguesas" },
  { name: "Hamburguesa Rústica", price: 3500, categorySlug: "hamburguesas", description: "Torta de carne arreglada, torta de pollo empanizada y jamón" },

  // Casados
  { name: "Casado con Costilla", price: 3500, categorySlug: "casados", description: "De lunes a viernes, incluye fresco natural" },
  { name: "Casado con Pollo", price: 3500, categorySlug: "casados", description: "De lunes a viernes, incluye fresco natural" },
  { name: "Casado con Chuleta", price: 3500, categorySlug: "casados", description: "De lunes a viernes, incluye fresco natural" },
  { name: "Casado con Bistec", price: 3500, categorySlug: "casados", description: "De lunes a viernes, incluye fresco natural" },

  // Menú para Niños
  { name: "Nuggets y papas", price: 2500, categorySlug: "ninos", description: "Incluye bebida" },

  // Tacos y Especialidades
  { name: "Taco sencillo de carne, pollo o pescado", price: 1000, categorySlug: "tacos" },
  { name: "Tacos chinos (3)", price: 1200, categorySlug: "tacos" },
  { name: "Samuray 4X4 (Solo)", price: 2000, categorySlug: "tacos" },
  { name: "Samuray 4X4 (con Papas)", price: 2500, categorySlug: "tacos" },
  { name: "Rústico (Solo)", price: 2500, categorySlug: "tacos" },
  { name: "Rústico (con Papas)", price: 3000, categorySlug: "tacos" },
  { name: "Taco de pescado Rústico (Solo)", price: 3000, categorySlug: "tacos" },
  { name: "Taco de pescado Rústico (con Papas)", price: 3500, categorySlug: "tacos" },

  // Porciones y Extras
  { name: "Orden de papas a la francesa", price: 1000, categorySlug: "extras" },
  { name: "Patacones con pico de gallo o frijoles", price: 1800, categorySlug: "extras" },
  { name: "Nuggets (8) con ensalada verde y papas", price: 3500, categorySlug: "extras" },
  { name: "Chalupas", price: 2000, categorySlug: "extras", description: "Pollo y frijol, repollo y pico de gallo" },

  // Bebidas
  { name: "Gaseosas 600ml", price: 1000, categorySlug: "bebidas" },
  { name: "Fresco natural pequeño", price: 600, categorySlug: "bebidas" },
  { name: "Fresco natural mediano", price: 800, categorySlug: "bebidas" },
  { name: "Fresco natural grande", price: 1000, categorySlug: "bebidas" },
  { name: "Batido en agua o leche pequeño", price: 1000, categorySlug: "bebidas" },
  { name: "Batido en agua o leche grande", price: 1200, categorySlug: "bebidas" }
];
