import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function sendEmail(
  apiKey: string,
  payload: { from: string; to: string; subject: string; html: string }
) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend misslyckades: ${text}`)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()

    if (!token) {
      return json({ error: 'token krävs' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('access_token', token)
      .single()

    if (error || !order) {
      return json({ error: 'Order hittades inte' }, 404)
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) {
      return json({ skipped: 'RESEND_API_KEY saknas' })
    }

    const from = Deno.env.get('RESEND_FROM') ?? 'Ljusets Barn <no-reply@ljusetsbarn.se>'
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://ljusetsbarn.se'
    const orderUrl = `${siteUrl}/orderbekraftelse/${order.access_token}`

    const items = (order.items ?? []) as Array<{
      product_name: string | null
      quantity: number
      price: number
    }>

    const rows = items
      .map(
        (item) =>
          `<tr><td style="padding:4px 0">${escapeHtml(item.product_name ?? 'Produkt')} x${item.quantity}</td><td style="padding:4px 0;text-align:right">${item.price * item.quantity} kr</td></tr>`
      )
      .join('')

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111827">
        <h1 style="color:#C9A227">Tack för din beställning!</h1>
        <p>Ordernummer: <strong>${escapeHtml(order.order_number)}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          ${rows}
          <tr><td style="padding-top:8px;font-weight:bold">Totalt</td><td style="padding-top:8px;text-align:right;font-weight:bold;color:#C9A227">${order.total} kr</td></tr>
        </table>
        ${
          order.swish_number
            ? `<p>Swisha <strong>${order.total} kr</strong> till <strong>${escapeHtml(order.swish_number)}</strong> och ange ordernummer <strong>${escapeHtml(order.order_number)}</strong> som meddelande.</p>`
            : ''
        }
        <p>Vi kontaktar dig när betalningen är bekräftad och ordern skickas.</p>
        <p><a href="${orderUrl}">Visa din order</a></p>
        <p><a href="${siteUrl}">Till butiken</a></p>
      </div>
    `

    await sendEmail(resendKey, {
      from,
      to: order.email,
      subject: `Orderbekräftelse ${order.order_number}`,
      html: customerHtml,
    })

    if (adminEmail) {
      const adminHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111827">
          <h1>Ny order ${escapeHtml(order.order_number)}</h1>
          <p><strong>Kund:</strong> ${escapeHtml(order.customer_name)}</p>
          <p><strong>E-post:</strong> ${escapeHtml(order.email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(order.phone)}</p>
          <p><strong>Adress:</strong> ${escapeHtml(order.address)}, ${escapeHtml(order.postal_code)} ${escapeHtml(order.city)}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}</table>
          <p><strong>Totalt:</strong> ${order.total} kr</p>
          ${order.message ? `<p><strong>Meddelande:</strong> ${escapeHtml(order.message)}</p>` : ''}
        </div>
      `

      await sendEmail(resendKey, {
        from,
        to: adminEmail,
        subject: `Ny order ${order.order_number}`,
        html: adminHtml,
      })
    }

    return json({ ok: true })
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500)
  }
})
