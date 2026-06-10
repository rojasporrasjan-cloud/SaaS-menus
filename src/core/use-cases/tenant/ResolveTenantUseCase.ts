import type { ITenantRepository } from '@core/domain/repositories/ITenantRepository'
import type { Tenant } from '@core/domain/entities/Tenant'

export class ResolveTenantUseCase {
  private readonly tenantRepository: ITenantRepository

  constructor(tenantRepository: ITenantRepository) {
    this.tenantRepository = tenantRepository
  }

  async executeById(tenantId: string): Promise<Tenant> {
    return this.tenantRepository.getById(tenantId)
  }

  async executeBySlug(slug: string): Promise<Tenant> {
    return this.tenantRepository.getBySlug(slug)
  }
}
