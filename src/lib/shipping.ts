import { prisma } from './prisma'

export interface ShippingOption {
  id: string
  name: string
  price: number
  minDays: number
  maxDays: number
  zoneId: string
  zoneName: string
}

export async function getShippingOptions(
  countryCode: string,
  subtotal: number,
  weightGrams: number
): Promise<ShippingOption[]> {
  const zones = await prisma.shippingZone.findMany({
    include: { rates: true },
  })

  const parseCountries = (raw: string): string[] => {
  try {
    // PostgreSQL array format: {US,GB,CA,...}
    if (raw.startsWith('{')) {
      return raw.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''))
    }
    // JSON array format: ["US","GB",...]
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const matchedZone =
  zones.find(z => parseCountries(z.countries).includes(countryCode)) ??
  zones.find(z => parseCountries(z.countries).includes('__default__'))

  if (!matchedZone) return []

  return matchedZone.rates
    .filter(r => !r.weightLimit || weightGrams <= r.weightLimit)
    .map(r => ({
      id: r.id,
      name: r.name,
      price: r.freeAbove && subtotal >= r.freeAbove ? 0 : r.price,
      minDays: r.minDays,
      maxDays: r.maxDays,
      zoneId: matchedZone.id,
      zoneName: matchedZone.name,
    }))
}

export function calculateTax(subtotal: number, countryCode: string): number {
  // Simplified VAT/tax logic
  const vatRates: Record<string, number> = {
    GB: 0.20,
    DE: 0.19,
    FR: 0.20,
    IT: 0.22,
    ES: 0.21,
    NL: 0.21,
    BE: 0.21,
    SE: 0.25,
    NO: 0.25,
    DK: 0.25,
    FI: 0.24,
    AT: 0.20,
    CH: 0.077,
    PL: 0.23,
    AU: 0.10,
    CA: 0.05,
    NZ: 0.15,
    JP: 0.10,
    SG: 0.09,
  }

  const rate = vatRates[countryCode] ?? 0
  return parseFloat((subtotal * rate).toFixed(2))
}

export const COUNTRY_CODES: { code: string; name: string }[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CN', name: 'China' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'PL', name: 'Poland' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'IN', name: 'India' },
]
