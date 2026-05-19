import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-terracotta" />
              <span className="text-lg font-bold">RuralsyncAI</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              Connecting travellers with Richmond&apos;s finest hospitality and attractions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/order" className="hover:text-terracotta transition-colors">Pre-Order Food</Link></li>
              <li><Link href="/attractions" className="hover:text-terracotta transition-colors">Attractions</Link></li>
              <li><Link href="/events" className="hover:text-terracotta transition-colors">Local Events</Link></li>
              <li><Link href="/assistant" className="hover:text-terracotta transition-colors">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Businesses */}
          <div>
            <h3 className="font-semibold mb-4">Our Partners</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/order/midway-restaurant" className="hover:text-terracotta transition-colors">Midway Restaurant</Link></li>
              <li><Link href="/order/mudhut-pub" className="hover:text-terracotta transition-colors">Mudhut Pub</Link></li>
              <li><Link href="/auth/sign-up" className="hover:text-terracotta transition-colors">Join as Business</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Richmond, QLD 4822
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@ruralsyncai.com.au
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                1800 RURAL AU
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} RuralsyncAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
