// components/ProductCard.tsx

import Link from 'next/link'
import { Product } from '../../lib/types'
import { formatPrice } from '../../lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.prices[0] // Get first price for simplicity
  
  if (!price || product.isArchived) {
    return null
  }

  const checkoutUrl = `/api/polar/checkout?products=${product.id}&price=${price.id}`

  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">
            {formatPrice(price.priceAmount, price.priceCurrency)}
          </span>
          {product.isRecurring && price.recurringInterval && (
            <span className="text-sm text-gray-500 ml-1">
              /{price.recurringInterval}
            </span>
          )}
        </div>
        
        <Link href={checkoutUrl}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            {product.isRecurring ? 'Subscribe' : 'Buy Now'}
          </button>
        </Link>
      </div>
    </div>
  )
}