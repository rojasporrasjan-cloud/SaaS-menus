import { useState } from 'react'
import { PlusCircle, QrCode, AlertCircle } from 'lucide-react'
import { useTenantContext } from '@app/providers/TenantProvider'
import {
  useTables,
  useGenerateQR,
  useCreateTable,
  TableQRCard,
  AddTableModal,
} from '@features/qr'
import { useAdminMenus } from '@features/dishes'
import { Button } from '@shared/ui/components/Button'
import { Spinner } from '@shared/ui/components/Spinner'
import { ROUTES } from '@shared/constants/routes'

function buildMenuUrl(tenantId: string, tableId: string): string {
  const base = ROUTES.public.menu.replace(':tenantId', tenantId)
  return `${window.location.origin}${base}?tableId=${tableId}`
}

export default function QRManagerPage() {
  const { tenantId } = useTenantContext()
  const { data: tables, isLoading, error } = useTables(tenantId)
  const { generateQR, isLoading: isGenerating, generatingTableId, error: generateError } = useGenerateQR(tenantId)
  const { createTable, isLoading: isCreating, error: createError } = useCreateTable(tenantId)
  const [showAddModal, setShowAddModal] = useState(false)

  const { data: menus } = useAdminMenus(tenantId)
  const defaultMenuId = menus?.[0]?.id ?? ''

  const handleGenerate = (tableId: string, menuUrl: string) => {
    void generateQR(tableId, menuUrl)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-zinc-400">
            Acceso al menú
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Códigos QR
          </h1>
          <p className="text-[13px] text-zinc-500">
            Gestiona los códigos QR de cada mesa para que los clientes escaneen y abran el menú.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          disabled={!defaultMenuId}
          title={!defaultMenuId ? 'Crea un menú primero antes de agregar mesas' : undefined}
          className="rounded-xl shadow-sm"
        >
          <PlusCircle size={15} className="mr-2" />
          Nueva mesa
        </Button>
      </div>

      {/* Error banner for generate */}
      {generateError && (
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-red-50 border border-red-100"
        >
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <p className="text-[13px] text-red-700">{generateError}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-red-50 border border-red-100"
        >
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <p className="text-[13px] text-red-700">
            Error cargando las mesas. Recarga la página.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && tables?.length === 0 && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-16 text-center border-2 border-dashed border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400"
          >
            <QrCode size={24} strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[15px] font-bold text-zinc-800">Sin mesas registradas</p>
          <p className="mt-1 text-[13px] text-zinc-500 max-w-[280px]">
            Agrega tu primera mesa para generar su código QR de acceso.
          </p>
          <Button
            className="mt-5 rounded-xl shadow-sm"
            onClick={() => setShowAddModal(true)}
            disabled={!defaultMenuId}
            title={!defaultMenuId ? 'Crea un menú primero' : undefined}
          >
            <PlusCircle size={15} className="mr-2" />
            Agregar mesa
          </Button>
        </div>
      )}

      {/* Table grid */}
      {!isLoading && !error && tables && tables.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => (
            <TableQRCard
              key={table.id}
              table={table}
              isGenerating={isGenerating && generatingTableId === table.id}
              onGenerate={handleGenerate}
              buildMenuUrl={(tableId) => buildMenuUrl(tenantId, tableId)}
            />
          ))}
        </div>
      )}

      {/* Add table modal */}
      {showAddModal && (
        <AddTableModal
          menuId={defaultMenuId}
          isLoading={isCreating}
          error={createError}
          onSubmit={async (values) => {
            await createTable(values)
            setShowAddModal(false)
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
