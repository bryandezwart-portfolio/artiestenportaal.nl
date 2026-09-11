import { redirect } from 'next/navigation'

// artiestenportaal.nl/facturen brengt je naar BDZFactuur.
// Handig als kortere weg; de app zelf draait op zijn eigen domein.
export const dynamic = 'force-dynamic'

export default function FacturenDoorsturen() {
  redirect('https://bdzfactuur.nl')
}
