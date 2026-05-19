import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { 
  MapPin, 
  Utensils, 
  Calendar, 
  MessageSquare, 
  Star, 
  Clock, 
  ChevronRight,
  Sparkles,
  Coffee,
  Truck,
  Users,
  CheckCircle2
} from 'lucide-react'

async function getFeaturedEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true })
    .limit(3)
  return data || []
}

async function getAttractions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('attractions')
    .select('*')
    .limit(4)
  return data || []
}

export default async function HomePage() {
  const [events, attractions] = await Promise.all([
    getFeaturedEvents(),
    getAttractions()
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-terracotta/10 to-background py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-1.5 text-sm font-medium text-terracotta mb-6">
                <Coffee className="h-4 w-4" />
                Practical Technology for Regional Australia
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
                Order Before You Arrive.{' '}
                <span className="text-terracotta">Skip the Queue.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Pre-order coffee, meals and snacks from Midway Roadhouse and Mud Hut before you pull in. 
                Perfect for truckies, travellers, and busy locals in Richmond, QLD.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-lg px-8" asChild>
                  <Link href="/order">
                    <Coffee className="mr-2 h-5 w-5" />
                    Order Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/assistant">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Ask a Local AI
                  </Link>
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-sage" />
                  Coffee ready when you arrive
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-sage" />
                  No phone calls needed
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-sage" />
                  Save time on the road
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Smart Service for Country Towns</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                No more waiting in queues or making phone calls. Order from your phone and pick up when ready.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Truckies</h3>
                <p className="text-muted-foreground">
                  Time-sensitive routes? Order your coffee and brekkie before you arrive. Priority pickup available.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-sage" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Travellers</h3>
                <p className="text-muted-foreground">
                  Driving through Richmond? Skip the queue and get back on the road faster with your meal ready to go.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-ochre/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-ochre" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Locals</h3>
                <p className="text-muted-foreground">
                  Busy morning? Order ahead and grab your coffee without the wait. Perfect for the school run or farm start.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to skip the queue
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="relative text-center">
                <div className="w-12 h-12 rounded-full bg-terracotta text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose Your Order</h3>
                <p className="text-sm text-muted-foreground">
                  Pick from Midway Restaurant or Mud Hut Pub menu
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-12 h-12 rounded-full bg-terracotta text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Set Pickup Time</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us when you&apos;ll arrive and we&apos;ll have it ready
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-12 h-12 rounded-full bg-terracotta text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Pick Up &amp; Go</h3>
                <p className="text-sm text-muted-foreground">
                  Walk in, grab your order, and get back on the road
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Restaurants */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Order From</h2>
                <p className="mt-2 text-muted-foreground">Your meal will be ready when you pull in</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex items-center gap-1" asChild>
                <Link href="/order">
                  View Menus <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-terracotta/20 to-ochre/20 flex items-center justify-center">
                  <Coffee className="h-16 w-16 text-terracotta/50" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Midway Roadhouse</h3>
                  <p className="text-muted-foreground mb-4">
                    Classic Australian meals, coffee, and snacks. Perfect pit-stop for travellers and truckies.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      6AM - 9PM
                    </span>
                    <span className="inline-flex items-center rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-medium text-sage">
                      Coffee Ready in 5 min
                    </span>
                  </div>
                  <Button className="w-full bg-terracotta hover:bg-terracotta/90" asChild>
                    <Link href="/order/midway-restaurant">Order Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-sage/20 to-dusty-blue/20 flex items-center justify-center">
                  <Utensils className="h-16 w-16 text-sage/50" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Mud Hut Pub</h3>
                  <p className="text-muted-foreground mb-4">
                    Cold beers, pub classics, and outback hospitality. The heart of Richmond&apos;s social scene.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      10AM - Late
                    </span>
                    <span className="inline-flex items-center rounded-full bg-sage/10 px-2.5 py-0.5 text-xs font-medium text-sage">
                      Meals Ready in 15 min
                    </span>
                  </div>
                  <Button className="w-full bg-terracotta hover:bg-terracotta/90" asChild>
                    <Link href="/order/mudhut-pub">Order Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Attractions Preview */}
        {attractions.length > 0 && (
          <section className="py-16 lg:py-24 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Must-See Attractions</h2>
                  <p className="mt-2 text-muted-foreground">Discover Richmond&apos;s unique prehistoric and natural wonders</p>
                </div>
                <Button variant="ghost" className="hidden sm:flex items-center gap-1" asChild>
                  <Link href="/attractions">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {attractions.map((attraction) => (
                  <Card key={attraction.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center mb-2">
                        <MapPin className="h-5 w-5 text-sage" />
                      </div>
                      <CardTitle className="text-base">{attraction.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{attraction.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{attraction.opening_hours}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Events Preview */}
        {events.length > 0 && (
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
                  <p className="mt-2 text-muted-foreground">Don&apos;t miss these exciting local events</p>
                </div>
                <Button variant="ghost" className="hidden sm:flex items-center gap-1" asChild>
                  <Link href="/events">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-xs text-terracotta font-medium mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(event.event_date).toLocaleDateString('en-AU', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-terracotta text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">Skip the Queue in the Outback</h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of truckies, travellers and locals who save time every day. 
              Create a free account and start ordering ahead.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/auth/sign-up">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/order">Order Without Account</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/60">
              Made for regional Australia. Built in Richmond, QLD.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
