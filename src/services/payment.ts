import type { PaymentService } from '../types'

interface SwishConfig {
  number: string
}

class SwishPrivatePayment implements PaymentService {
  name = 'Swish (privat)'
  private number: string

  constructor(number: string) {
    this.number = number
  }

  async processPayment(_orderId: string, _total: number) {
    return { success: true }
  }

  getNumber() {
    return this.number
  }
}

class StripePayment implements PaymentService {
  name = 'Stripe'

  async processPayment(orderId: string, total: number) {
    const { redirectUrl } = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, total }),
    }).then((r) => r.json())
    return { success: true, redirectUrl }
  }
}

class KlarnaPayment implements PaymentService {
  name = 'Klarna'

  async processPayment(orderId: string, total: number) {
    const { redirectUrl } = await fetch('/api/klarna/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, total }),
    }).then((r) => r.json())
    return { success: true, redirectUrl }
  }
}

export function createPaymentService(type: 'swish' | 'stripe' | 'klarna', config?: SwishConfig): PaymentService {
  switch (type) {
    case 'swish':
      return new SwishPrivatePayment(config?.number ?? '0701234567')
    case 'stripe':
      return new StripePayment()
    case 'klarna':
      return new KlarnaPayment()
  }
}
