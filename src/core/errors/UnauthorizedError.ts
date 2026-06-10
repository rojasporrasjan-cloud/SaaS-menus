import { DomainError } from './DomainError'

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED'

  constructor(action?: string) {
    super(action ? `Not authorized to perform: ${action}` : 'Unauthorized access.')
  }
}
