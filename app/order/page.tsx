import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Utensils, Clock, MapPin, Star } from 'lucide-react'

const businesses = [
  {
    slug: 'midway-restaurant',
    name: 'Midway Restaurant',
    description: 'Classic Australian cuisine with outback hospitality. Perfect for travellers looking for hearty meals and friendly service.',
    hours: '6:00 AM - 9:00 PM',
    address: 'Flinders Highway, Richmond QLD',
    rating: 4.5,
    specialties: ['Breakfast', 'Steaks', 'Burgers', 'Australian Classics'],
    color: 'terracotta'
  },
  {
    slug: 'mudhut-pub',
    name: 'Mudhut Pub',
    description: 'Authentic outback pub experience with cold drinks, pub classics, and live entertainment. The heart of Richmond social life.',
    hours: '11:00 AM - Late',
    address: 'Goldring Street, Richmond QLD',
    rating: 4.7,
    specialties: ['Pub Meals', 'Steaks', 'Seafood', 'Cold Beer'],
    color: 'sage'
  }
]

export default function OrderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-terracotta/10 to-background py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Pre-Order Your Meal</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Skip the wait! Order ahead from Richmond&apos;s best restaurants and have your meal ready when you arrive.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-8 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold mb-3">1</div>
                <h3 className="font-semibold mb-1">Choose Your Venue</h3>
                <p className="text-sm text-muted-foreground">Select from our partner restaurants</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold mb-3">2</div>
                <h3 className="font-semibold mb-1">Select & Schedule</h3>
                <p className="text-sm text-muted-foreground">Pick your items and pickup time</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold mb-3">3</div>
                <h3 className="font-semibold mb-1">Pickup When Ready</h3>
                <p className="text-sm text-muted-foreground">{"Get notified and collect your order"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant List */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Choose a Restaurant</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {businesses.map((business) => (
                <Card key={business.slug} className="overflow-hidden hover:shadow-lg transition-all group">
                  <div className={`h-48 bg-gradient-to-br ${business.color === 'terracotta' ? 'from-terracotta/20 to-ochre/20' : 'from-sage/20 to-dusty-blue/20'} flex items-center justify-center`}>
                    <Utensils className={`h-20 w-20 ${business.color === 'terracotta' ? 'text-terracotta/40' : 'text-sage/40'} group-hover:scale-110 transition-transform`} />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{business.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-ochre text-ochre" />
                          <span className="text-sm font-medium">{business.rating}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">{business.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {business.specialties.map((specialty) => (
                        <span key={specialty} className="px-2 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {business.hours}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {business.address}
                    </div>
                    
                    <Button className="w-full bg-terracotta hover:bg-terracotta/90" asChild>
                      <Link href={`/order/${business.slug}`}>View Menu & Order</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
