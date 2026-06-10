import { QrCode, Download, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Button } from '@shared/ui/components/Button'
import { Spinner } from '@shared/ui/components/Spinner'
import type { Table } from '@core/domain/entities/Table'

interface TableQRCardProps {
  table: Table
  isGenerating: boolean
  onGenerate: (tableId: string, menuUrl: string) => void
  buildMenuUrl: (tableId: string) => string
}

export function TableQRCard({
  table,
  isGenerating,
  onGenerate,
  buildMenuUrl,
}: TableQRCardProps) {
  const menuUrl = buildMenuUrl(table.id)
  const hasQR = !!table.qrCodeUrl

  const handleDownload = () => {
    if (!table.qrCodeUrl) return
    const a = document.createElement('a')
    a.href = table.qrCodeUrl
    a.download = `qr-mesa-${table.number}.png`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-4"
      style={{
        background: '#ffffff',
        border:     '1px solid #efede9',
        boxShadow:  '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-semibold" style={{ color: '#27251f' }}>
            Mesa {table.number}
          </p>
          {table.label && (
            <p className="text-[11px]" style={{ color: '#a8a49d' }}>{table.label}</p>
          )}
        </div>
        {hasQR && (
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{ background: 'rgba(16,185,129,0.1)' }}
          >
            <CheckCircle2 size={11} style={{ color: '#059669' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#059669' }}>QR listo</span>
          </div>
        )}
      </div>

      {/* QR preview */}
      <div
        className="flex aspect-square items-center justify-center rounded-xl p-4"
        style={{ background: '#faf9f7' }}
      >
        {isGenerating ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <p className="text-[11px]" style={{ color: '#a8a49d' }}>Generando...</p>
          </div>
        ) : hasQR ? (
          <img
            src={table.qrCodeUrl ?? ''}
            alt={`QR Mesa ${table.number}`}
            className="w-full max-w-[160px] rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-2" style={{ color: '#bfbbb4' }}>
            <QrCode size={48} strokeWidth={1} />
            <p className="text-[11px]">Sin código QR</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          isLoading={isGenerating}
          onClick={() => onGenerate(table.id, menuUrl)}
        >
          {hasQR ? (
            <>
              <RefreshCw size={13} className="mr-1.5" />
              Regenerar
            </>
          ) : (
            <>
              <QrCode size={13} className="mr-1.5" />
              Generar QR
            </>
          )}
        </Button>

        {hasQR && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            aria-label="Descargar QR"
          >
            <Download size={13} />
          </Button>
        )}
      </div>
    </div>
  )
}
