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
  Sparkles
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
                <MapPin className="h-4 w-4" />
                Richmond, Queensland
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
                Connect with the Heart of{' '}
                <span className="text-terracotta">Australia&apos;s Outback</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Pre-order meals from local restaurants, discover prehistoric attractions, 
                and explore upcoming events - all before you arrive in Richmond.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-lg px-8" asChild>
                  <Link href="/order">
                    <Utensils className="mr-2 h-5 w-5" />
                    Pre-Order Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/assistant">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Ask AI Assistant
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">How RuralsyncAI Works</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Plan your visit to Richmond with ease - everything you need in one place.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-transparent hover:border-terracotta/20 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center mb-4">
                    <Utensils className="h-6 w-6 text-terracotta" />
                  </div>
                  <CardTitle className="text-lg">Pre-Order Meals</CardTitle>
                  <CardDescription>
                    Order from Midway Restaurant or Mudhut Pub before you arrive. Your food will be ready when you get there.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-transparent hover:border-sage/20 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-sage" />
                  </div>
                  <CardTitle className="text-lg">Explore Attractions</CardTitle>
                  <CardDescription>
                    Discover Kronosaurus Korner, Lake Fred Tritton, and other must-see destinations in Richmond.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-transparent hover:border-ochre/20 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-ochre/10 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-ochre" />
                  </div>
                  <CardTitle className="text-lg">Local Events</CardTitle>
                  <CardDescription>
                    Stay updated on Field Days, Starry Nights, and other community events happening in the region.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-transparent hover:border-dusty-blue/20 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-dusty-blue/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-dusty-blue" />
                  </div>
                  <CardTitle className="text-lg">AI Travel Assistant</CardTitle>
                  <CardDescription>
                    Get personalized recommendations and answers about Richmond from our intelligent travel guide.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Partner Restaurants */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Order Ahead</h2>
                <p className="mt-2 text-muted-foreground">Skip the wait - your meal will be ready when you arrive</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex items-center gap-1" asChild>
                <Link href="/order">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-terracotta/20 to-ochre/20 flex items-center justify-center">
                  <Utensils className="h-16 w-16 text-terracotta/50" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Midway Restaurant</h3>
                  <p className="text-muted-foreground mb-4">
                    Classic Australian cuisine with outback hospitality. Perfect for travellers looking for hearty meals.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      6:00 AM - 9:00 PM
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
                  <h3 className="text-xl font-semibold mb-2">Mudhut Pub</h3>
                  <p className="text-muted-foreground mb-4">
                    Authentic outback pub experience with cold drinks, pub classics, and live entertainment.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      11:00 AM - Late
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
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">Ready to Experience Richmond?</h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Join RuralsyncAI today and start planning your outback adventure. Pre-order meals, 
              discover attractions, and never miss a local event.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/auth/sign-up">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/assistant">Chat with AI Assistant</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
