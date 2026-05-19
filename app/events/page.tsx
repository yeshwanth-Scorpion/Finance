import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Star } from 'lucide-react'

async function getEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true })
  return data || []
}

async function getPastEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .lt('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: false })
    .limit(3)
  return data || []
}

const categoryColors: Record<string, string> = {
  Agricultural: 'bg-ochre/10 text-ochre',
  Nature: 'bg-sage/10 text-sage',
  Cultural: 'bg-terracotta/10 text-terracotta',
  Music: 'bg-dusty-blue/10 text-dusty-blue',
  Sports: 'bg-green-100 text-green-800',
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents(),
    getPastEvents()
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-ochre/10 to-background py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Local Events</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                From agricultural shows to stargazing nights, Richmond hosts events that celebrate outback life and community spirit.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        {upcomingEvents.filter(e => e.is_featured).length > 0 && (
          <section className="py-12 lg:py-16 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-8">
                <Star className="h-5 w-5 text-ochre" />
                <h2 className="text-2xl font-bold">Featured Events</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.filter(e => e.is_featured).map((event) => (
                  <Card key={event.id} className="overflow-hidden border-2 border-ochre/20 hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-ochre/30 to-terracotta/20 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-ochre/50" />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-2 bg-ochre text-primary-foreground">Featured</Badge>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                        </div>
                        {event.category && (
                          <Badge className={categoryColors[event.category] || 'bg-muted text-muted-foreground'}>
                            {event.category}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-terracotta">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString('en-AU', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      
                      {(event.start_time || event.end_time) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.start_time && event.start_time.slice(0, 5)}
                          {event.start_time && event.end_time && ' - '}
                          {event.end_time && event.end_time.slice(0, 5)}
                        </div>
                      )}
                      
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

        {/* All Upcoming Events */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Upcoming Events</h2>
            
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No Upcoming Events</h3>
                  <p className="text-muted-foreground">Check back soon for new events in the Richmond area.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-sm font-medium text-terracotta flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.event_date).toLocaleDateString('en-AU', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                        {event.category && (
                          <Badge className={categoryColors[event.category] || 'bg-muted text-muted-foreground'} variant="outline">
                            {event.category}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(event.start_time || event.end_time) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.start_time && event.start_time.slice(0, 5)}
                          {event.start_time && event.end_time && ' - '}
                          {event.end_time && event.end_time.slice(0, 5)}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="py-12 lg:py-16 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-8 text-muted-foreground">Past Events</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-75">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(event.event_date).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <CardTitle className="text-base text-muted-foreground">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stay Updated */}
        <section className="py-12 lg:py-16 bg-terracotta text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Never Miss an Event</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-lg mx-auto">
              Create a free RuralsyncAI account to get notified about upcoming events and special offers from local businesses.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
