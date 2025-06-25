
import { polar } from '@/app/lib/polar'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await polar.products.list({
      isArchived: false,
    })

    return NextResponse.json(response.result)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}