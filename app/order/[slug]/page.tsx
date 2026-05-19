'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Clock, 
  MapPin, 
  ShoppingCart,
  Loader2,
  AlertCircle,
  Truck
} from 'lucide-react'
import { toast } from 'sonner'

// Demo menu data for the restaurants
const menuData: Record<string, {
  name: string
  description: string
  address: string
  categories: { name: string; items: MenuItem[] }[]
}> = {
  'midway-restaurant': {
    name: 'Midway Restaurant',
    description: 'Classic Australian cuisine with outback hospitality',
    address: 'Flinders Highway, Richmond QLD',
    categories: [
      {
        name: 'Breakfast',
        items: [
          { id: 'mr-1', name: 'Big Outback Breakfast', description: 'Eggs, bacon, sausages, hash browns, grilled tomato, mushrooms & toast', price: 24.50, prepTime: 20 },
          { id: 'mr-2', name: 'Eggs Benedict', description: 'Poached eggs on English muffin with hollandaise sauce and your choice of ham or salmon', price: 19.50, prepTime: 15 },
          { id: 'mr-3', name: 'Pancake Stack', description: 'Fluffy pancakes with maple syrup, fresh berries and whipped cream', price: 16.50, prepTime: 12 },
        ]
      },
      {
        name: 'Mains',
        items: [
          { id: 'mr-4', name: 'Rump Steak 300g', description: 'Char-grilled rump with chips, salad and your choice of sauce', price: 32.00, prepTime: 25 },
          { id: 'mr-5', name: 'Chicken Parmigiana', description: 'Crumbed chicken breast topped with napoli sauce, ham and cheese, served with chips and salad', price: 26.50, prepTime: 20 },
          { id: 'mr-6', name: 'Fish & Chips', description: 'Beer battered barramundi with chips, salad and tartare sauce', price: 24.00, prepTime: 18 },
          { id: 'mr-7', name: 'Outback Burger', description: 'Beef patty with bacon, cheese, beetroot, egg, lettuce, tomato and BBQ sauce on a brioche bun', price: 22.00, prepTime: 15 },
        ]
      },
      {
        name: 'Drinks',
        items: [
          { id: 'mr-8', name: 'Coffee', description: 'Latte, Cappuccino, Flat White or Long Black', price: 5.00, prepTime: 5 },
          { id: 'mr-9', name: 'Fresh Juice', description: 'Orange, Apple or Tropical', price: 6.50, prepTime: 5 },
          { id: 'mr-10', name: 'Milkshake', description: 'Chocolate, Vanilla, Strawberry or Caramel', price: 7.50, prepTime: 5 },
        ]
      }
    ]
  },
  'mudhut-pub': {
    name: 'Mudhut Pub',
    description: 'Authentic outback pub experience',
    address: 'Goldring Street, Richmond QLD',
    categories: [
      {
        name: 'Pub Classics',
        items: [
          { id: 'mp-1', name: 'Steak Sandwich', description: 'Scotch fillet steak with caramelised onion, bacon, cheese, lettuce, tomato and BBQ sauce on Turkish bread', price: 24.00, prepTime: 18 },
          { id: 'mp-2', name: 'Chicken Schnitzel', description: 'Golden crumbed chicken breast with chips, salad and gravy', price: 23.50, prepTime: 20 },
          { id: 'mp-3', name: 'Beef & Guinness Pie', description: 'Slow cooked beef in rich Guinness gravy, served with mash and vegetables', price: 25.00, prepTime: 15 },
        ]
      },
      {
        name: 'Steaks',
        items: [
          { id: 'mp-4', name: 'Scotch Fillet 250g', description: 'MSA graded scotch fillet with chips, salad and your choice of sauce', price: 38.00, prepTime: 25 },
          { id: 'mp-5', name: 'T-Bone 400g', description: 'Char-grilled T-bone with chips, salad and your choice of sauce', price: 42.00, prepTime: 28 },
          { id: 'mp-6', name: 'Surf & Turf', description: 'Rump steak topped with prawns in garlic butter, served with chips and salad', price: 44.00, prepTime: 25 },
        ]
      },
      {
        name: 'Sides & Extras',
        items: [
          { id: 'mp-7', name: 'Bowl of Chips', description: 'Crispy golden chips with aioli', price: 10.00, prepTime: 10 },
          { id: 'mp-8', name: 'Garden Salad', description: 'Fresh mixed leaves with house dressing', price: 8.00, prepTime: 5 },
          { id: 'mp-9', name: 'Garlic Bread', description: 'Toasted garlic bread with herb butter', price: 8.50, prepTime: 8 },
        ]
      },
      {
        name: 'Drinks',
        items: [
          { id: 'mp-10', name: 'Soft Drink', description: 'Coke, Sprite, Fanta or Lemonade', price: 4.50, prepTime: 2 },
          { id: 'mp-11', name: 'Coffee', description: 'Your choice of coffee', price: 5.00, prepTime: 5 },
        ]
      }
    ]
  }
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  prepTime: number
}

interface CartItem extends MenuItem {
  quantity: number
  specialInstructions?: string
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function RestaurantOrderPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string>('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [pickupTime, setPickupTime] = useState('')
  const [notes, setNotes] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isPriority, setIsPriority] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [dbMenuItems, setDbMenuItems] = useState<{ id: string; name: string; description: string; price: number; category: string; prep_time_minutes: number }[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setCustomerName(profile.full_name || '')
          setCustomerPhone(profile.phone || '')
        }
      }
    }
    getUser()
  }, [supabase])

  // Fetch business and menu items from database
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!slug) return
      
      // Fetch business by slug
      const { data: business } = await supabase
        .from('businesses')
        .select('id, name, description, address')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
      
      if (business) {
        setBusinessId(business.id)
        
        // Fetch menu items for this business
        const { data: menuItems } = await supabase
          .from('menu_items')
          .select('id, name, description, price, category, prep_time_minutes')
          .eq('business_id', business.id)
          .eq('is_available', true)
          .order('category')
        
        if (menuItems) {
          setDbMenuItems(menuItems)
        }
      }
    }
    
    fetchBusinessData()
  }, [slug, supabase])

  const restaurant = menuData[slug]
  
  // Group database menu items by category
  const groupedDbItems = dbMenuItems.reduce((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof dbMenuItems>)

  // Use database items if available, otherwise fall back to static menu
  const useDbMenu = dbMenuItems.length > 0

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    )
  }

  if (!restaurant && !businessId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
            <Button asChild>
              <Link href="/order">Back to Restaurants</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    toast.success(`Added ${item.name} to cart`)
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
      }
      return prev.filter(i => i.id !== itemId)
    })
  }

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0)
  const getEstimatedPrepTime = () => Math.max(...cart.map(i => i.prepTime), 0)

  const handleSubmitOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order')
      router.push(`/auth/login?redirect=/order/${slug}`)
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!pickupTime) {
      toast.error('Please select a pickup time')
      return
    }

    if (!customerName || !customerPhone) {
      toast.error('Please provide your name and phone number')
      return
    }

    setLoading(true)

    try {
      if (!businessId) {
        throw new Error('Business not found')
      }
      
      // Create the order with the real business ID from database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          business_id: businessId,
          status: 'pending',
          pickup_time: new Date(pickupTime).toISOString(),
          total_amount: getCartTotal(),
          notes,
          customer_name: customerName,
          customer_phone: customerPhone,
          is_priority: isPriority,
        })
        .select()
        .single()

      if (orderError) {
        console.error('[v0] Order error:', orderError)
        throw new Error('Failed to create order')
      }

      // Insert order items with real menu_item_ids from database
      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        special_instructions: item.specialInstructions || null,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('[v0] Order items error:', itemsError)
        // Don't throw - order was created, just items failed
      }

      // Create notification for the customer
      const restaurantName = restaurant?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      await supabase.from('notifications').insert({
        user_id: user.id,
        order_id: order.id,
        title: 'Order Placed',
        message: `Your order at ${restaurantName} has been placed successfully. We'll notify you when it's confirmed.`,
      })

      toast.success('Order placed successfully!')
      router.push('/orders')
    } catch {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Generate pickup time options (next 4 hours in 15-min intervals)
  const getPickupTimeOptions = () => {
    const options: string[] = []
    const now = new Date()
    const minPrepTime = getEstimatedPrepTime()
    
    // Start from next 15-min interval + prep time
    const startTime = new Date(now)
    startTime.setMinutes(Math.ceil((now.getMinutes() + minPrepTime) / 15) * 15, 0, 0)
    
    for (let i = 0; i < 16; i++) {
      const time = new Date(startTime.getTime() + i * 15 * 60 * 1000)
      options.push(time.toISOString())
    }
    
    return options
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        {/* Header */}
        <div className="bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/order" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Restaurants
            </Link>
            <h1 className="text-3xl font-bold">{restaurant?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h1>
            <p className="text-muted-foreground mt-1">{restaurant?.description || 'Delicious food awaits'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {restaurant?.address || 'Richmond, QLD'}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu */}
            <div className="lg:col-span-2 space-y-8">
              {useDbMenu ? (
                // Database menu items
                Object.entries(groupedDbItems).map(([categoryName, items]) => (
                  <div key={categoryName}>
                    <h2 className="text-xl font-semibold mb-4">{categoryName}</h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex items-center justify-between p-4">
                            <div className="flex-1 pr-4">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="font-semibold text-terracotta">${Number(item.price).toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.prep_time_minutes} min
                                </span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-terracotta hover:bg-terracotta/90"
                              onClick={() => addToCart({ 
                                id: item.id, 
                                name: item.name, 
                                description: item.description || '', 
                                price: Number(item.price), 
                                prepTime: item.prep_time_minutes 
                              })}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : restaurant ? (
                // Fallback static menu
                restaurant.categories.map((category) => (
                <div key={category.name}>
                  <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex-1 pr-4">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="font-semibold text-terracotta">${item.price.toFixed(2)}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.prepTime} min
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-terracotta hover:bg-terracotta/90"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-terracotta mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading menu...</p>
                </div>
              )}
            </div>

            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Your Order
                    </CardTitle>
                    <CardDescription>
                      {getCartCount()} items - ${getCartTotal().toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Your cart is empty. Add items from the menu to get started.
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground">${item.price.toFixed(2)} each</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center font-medium">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => addToCart(item)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="customerName">Your Name</Label>
                            <Input 
                              id="customerName"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="Enter your name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="customerPhone">Phone Number</Label>
                            <Input 
                              id="customerPhone"
                              type="tel"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="0412 345 678"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pickupTime">Pickup Time</Label>
                            <select 
                              id="pickupTime"
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            >
                              <option value="">Select pickup time</option>
                              {getPickupTimeOptions().map((time) => (
                                <option key={time} value={time}>
                                  {new Date(time).toLocaleTimeString('en-AU', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">Special Instructions (Optional)</Label>
                            <Textarea 
                              id="notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Any allergies or special requests?"
                              rows={2}
                            />
                          </div>

                          {/* Truckie Priority Pickup */}
                          <div 
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              isPriority 
                                ? 'border-terracotta bg-terracotta/5' 
                                : 'border-border hover:border-terracotta/50'
                            }`}
                            onClick={() => setIsPriority(!isPriority)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isPriority ? 'bg-terracotta text-white' : 'bg-muted'
                              }`}>
                                <Truck className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm">Truckie Priority Pickup</h4>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    isPriority ? 'border-terracotta bg-terracotta' : 'border-muted-foreground'
                                  }`}>
                                    {isPriority && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Time-sensitive? We&apos;ll prioritise your order so it&apos;s ready faster when you pull in.
                                </p>
                                {isPriority && (
                                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-terracotta">
                                    <Clock className="h-3 w-3" />
                                    Priority order - prepared first
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {!user && (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Please <Link href={`/auth/login?redirect=/order/${slug}`} className="text-terracotta underline">sign in</Link> to place your order.
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="pt-2">
                            <div className="flex justify-between text-lg font-semibold mb-4">
                              <span>Total</span>
                              <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                            <Button 
                              className="w-full bg-terracotta hover:bg-terracotta/90"
                              onClick={handleSubmitOrder}
                              disabled={loading || cart.length === 0}
                            >
                              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Place Order
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
