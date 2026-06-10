import { doc, setDoc, collection, writeBatch } from 'firebase/firestore'
import { db } from '../infrastructure/firebase/firestore'
import { firestorePaths } from '../infrastructure/firebase/paths'
import { categoriesData, dishesData } from './sodaLaRusticaData'

async function seed() {
  const tenantId = 'soda-la-rustica'
  const menuRef = doc(collection(db, firestorePaths.menus(tenantId)))
  const menuId = menuRef.id

  console.log(`Starting seed for tenant: ${tenantId}...`)

  // 1. Create Menu
  await setDoc(menuRef, {
    id: menuId,
    name: 'Menú Principal',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Assigning the requested template
    templateId: 'soda-tica',
    currency: 'CRC',
  })
  console.log(`Created Menu: ${menuId}`)

  // 2. Create Categories & keep track of their generated IDs
  const categoryIdMap = new Map<string, string>() // slug -> id
  const batch = writeBatch(db)

  for (const cat of categoriesData) {
    const catRef = doc(collection(db, firestorePaths.categories(tenantId, menuId)))
    const catId = catRef.id
    categoryIdMap.set(cat.slug, catId)

    batch.set(catRef, {
      id: catId,
      name: cat.name,
      description: cat.description || '',
      status: 'active',
      sortOrder: cat.sortOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  // 3. Create Dishes
  let dishSortOrder = 1
  for (const dish of dishesData) {
    const categoryId = categoryIdMap.get(dish.categorySlug)

    if (!categoryId) {
      console.warn(`Category not found for dish: ${dish.name}`)
      continue
    }

    const dishRef = doc(collection(db, firestorePaths.dishes(tenantId, menuId)))
    const dishId = dishRef.id
    batch.set(dishRef, {
      id: dishId,
      categoryId,
      name: dish.name,
      description: dish.description || '',
      price: dish.price,
      status: 'active',
      sortOrder: dishSortOrder++,
      isPopular: false,
      isSpicy: false,
      isVegetarian: false,
      isGlutenFree: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  console.log('Committing batch...')
  await batch.commit()

  // 4. Update the tenant's settings to use this menu's active template (if applicable)
  // Some SaaS store the active template on the tenant or menu. We put templateId on the Menu.

  console.log('Seed completed successfully!')
  process.exit(0)
}

seed().catch(console.error)
