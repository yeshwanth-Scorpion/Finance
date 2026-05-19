'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { 
  MapPin, 
  LayoutDashboard, 
  ShoppingBag, 
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ChefHat,
  LogOut,
  MoreVertical,
  User
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Order {
  id: string
  customer_id: string
  business_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  pickup_time: string
  total_amount: string
  notes: string | null
  customer_name: string | null
  customer_phone: string | null
  created_at: string
  updated_at: string
}

interface Business {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Profile {
  user_type: string
  full_name: string | null
}

interface Stats {
  todayOrders: number
  todayRevenue: number
  pendingCount: number
  preparingCount: number
  readyCount: number
}

interface DashboardContentProps {
  user: SupabaseUser
  profile: Profile | null
  business: Business | null
  orders: Order[]
  stats: Stats
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-orange-100 text-orange-800 border-orange-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function DashboardContent({ user, profile, business, orders: initialOrders, stats }: DashboardContentProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o
      ))

      // Create notification for customer
      const order = orders.find(o => o.id === orderId)
      if (order) {
        let notificationMessage = ''
        switch (newStatus) {
          case 'confirmed':
            notificationMessage = 'Your order has been confirmed and will be prepared soon.'
            break
          case 'preparing':
            notificationMessage = 'Your order is now being prepared.'
            break
          case 'ready':
            notificationMessage = 'Your order is ready for pickup!'
            break
          case 'completed':
            notificationMessage = 'Thank you for your order! We hope you enjoyed your meal.'
            break
          case 'cancelled':
            notificationMessage = 'Unfortunately, your order has been cancelled. Please contact us for details.'
            break
        }

        if (notificationMessage) {
          await supabase.from('notifications').insert({
            user_id: order.customer_id,
            order_id: orderId,
            title: `Order ${statusLabels[newStatus]}`,
            message: notificationMessage,
          })
        }
      }

      toast.success(`Order marked as ${statusLabels[newStatus]}`)
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const getNextStatus = (currentStatus: string): string | null => {
    const flow: Record<string, string> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed',
    }
    return flow[currentStatus] || null
  }

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const activeOrders = orders.filter(o => ['confirmed', 'preparing'].includes(o.status))
  const readyOrders = orders.filter(o => o.status === 'ready')
  const completedOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status))

  const OrderCard = ({ order }: { order: Order }) => {
    const nextStatus = getNextStatus(order.status)
    
    return (
      <Card className={`${order.status === 'pending' ? 'border-yellow-300 bg-yellow-50/50' : order.status === 'ready' ? 'border-green-300 bg-green-50/50' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
              <CardDescription className="text-xs">
                {new Date(order.created_at).toLocaleTimeString('en-AU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[order.status]}>
                {statusLabels[order.status]}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'confirmed')} disabled={order.status !== 'pending'}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'preparing')} disabled={order.status === 'pending'}>
                        <ChefHat className="h-4 w-4 mr-2" />
                        Start Preparing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'ready')} disabled={order.status === 'pending'}>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Mark Ready
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'completed')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')} className="text-destructive">
                        Cancel Order
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Customer</p>
              <p className="font-medium">{order.customer_name || 'Guest'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="font-medium">{order.customer_phone || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Pickup: {new Date(order.pickup_time).toLocaleTimeString('en-AU', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </span>
            <span className="font-semibold text-terracotta">${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>

          {order.notes && (
            <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
              Note: {order.notes}
            </p>
          )}

          {nextStatus && order.status !== 'completed' && order.status !== 'cancelled' && (
            <Button 
              className="w-full bg-terracotta hover:bg-terracotta/90"
              size="sm"
              onClick={() => updateOrderStatus(order.id, nextStatus)}
              disabled={updating === order.id}
            >
              {updating === order.id ? 'Updating...' : `Mark as ${statusLabels[nextStatus]}`}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-terracotta" />
                <span className="text-lg font-bold">RuralsyncAI</span>
              </Link>
              <span className="text-muted-foreground">|</span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <LayoutDashboard className="h-4 w-4" />
                Business Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {profile?.full_name || user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-terracotta/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-terracotta" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  <p className="text-xs text-muted-foreground">Today&apos;s Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sage/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${stats.todayRevenue.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Today&apos;s Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.pendingCount > 0 ? 'border-yellow-300 bg-yellow-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.preparingCount}</p>
                  <p className="text-xs text-muted-foreground">Preparing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.readyCount > 0 ? 'border-green-300 bg-green-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.readyCount}</p>
                  <p className="text-xs text-muted-foreground">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOrders.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-500 text-primary-foreground rounded-full">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              {activeOrders.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 text-primary-foreground rounded-full">
                  {activeOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready">
              Ready
              {readyOrders.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-500 text-primary-foreground rounded-full">
                  {readyOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">All Caught Up!</h3>
                  <p className="text-muted-foreground">No pending orders to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ChefHat className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No Active Orders</h3>
                  <p className="text-muted-foreground">Orders being prepared will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ready">
            {readyOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No Orders Ready</h3>
                  <p className="text-muted-foreground">Orders ready for pickup will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No Completed Orders Yet</h3>
                  <p className="text-muted-foreground">Completed orders will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOrders.slice(0, 12).map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
