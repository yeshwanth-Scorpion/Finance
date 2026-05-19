import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Ticket, ExternalLink } from 'lucide-react'

async function getAttractions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('attractions')
    .select('*')
    .order('name', { ascending: true })
  return data || []
}

const categoryColors: Record<string, string> = {
  Museum: 'bg-terracotta/10 text-terracotta',
  Nature: 'bg-sage/10 text-sage',
  Heritage: 'bg-ochre/10 text-ochre',
  Recreation: 'bg-dusty-blue/10 text-dusty-blue',
}

export default async function AttractionsPage() {
  const attractions = await getAttractions()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-sage/10 to-background py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Discover Richmond</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                From ancient marine fossils to stunning outback landscapes, Richmond offers unique experiences you won&apos;t find anywhere else.
              </p>
            </div>
          </div>
        </section>

        {/* Attractions Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions.map((attraction) => (
                <Card key={attraction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-40 flex items-center justify-center ${
                    attraction.category === 'Museum' ? 'bg-gradient-to-br from-terracotta/20 to-ochre/20' :
                    attraction.category === 'Nature' ? 'bg-gradient-to-br from-sage/20 to-dusty-blue/20' :
                    'bg-gradient-to-br from-ochre/20 to-terracotta/20'
                  }`}>
                    <MapPin className={`h-16 w-16 ${
                      attraction.category === 'Museum' ? 'text-terracotta/40' :
                      attraction.category === 'Nature' ? 'text-sage/40' :
                      'text-ochre/40'
                    }`} />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{attraction.name}</CardTitle>
                      {attraction.category && (
                        <Badge className={categoryColors[attraction.category] || 'bg-muted text-muted-foreground'}>
                          {attraction.category}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base line-clamp-3">
                      {attraction.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {attraction.location}
                    </div>
                    
                    {attraction.opening_hours && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {attraction.opening_hours}
                      </div>
                    )}
                    
                    {attraction.admission_info && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Ticket className="h-4 w-4" />
                        {attraction.admission_info}
                      </div>
                    )}

                    {attraction.website_url && (
                      <a 
                        href={attraction.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-terracotta hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {attractions.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Attractions Found</h3>
                <p className="text-muted-foreground">Check back soon for more places to visit.</p>
              </div>
            )}
          </div>
        </section>

        {/* Travel Tips */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Travel Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">☀️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Best Time to Visit</h3>
                  <p className="text-sm text-muted-foreground">
                    April to October offers the best weather with cooler temperatures and clear skies.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <h3 className="font-semibold mb-2">Getting Around</h3>
                  <p className="text-sm text-muted-foreground">
                    A car is essential. Richmond is 500km west of Townsville on the Flinders Highway.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-ochre/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="font-semibold mb-2">Stargazing</h3>
                  <p className="text-sm text-muted-foreground">
                    The outback skies are perfect for stargazing. Bring a camera for the Milky Way!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
