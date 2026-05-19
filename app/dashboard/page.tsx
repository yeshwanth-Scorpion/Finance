import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from './dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  // Check if user is a business owner
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.user_type !== 'business') {
    redirect('/')
  }

  // Fetch business for this owner
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  // Fetch orders for this business (for demo, we'll fetch all orders)
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Calculate stats
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const todayOrders = orders?.filter(o => new Date(o.created_at) >= todayStart) || []
  const pendingOrders = orders?.filter(o => o.status === 'pending') || []
  const preparingOrders = orders?.filter(o => o.status === 'preparing' || o.status === 'confirmed') || []
  const readyOrders = orders?.filter(o => o.status === 'ready') || []

  const stats = {
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
    pendingCount: pendingOrders.length,
    preparingCount: preparingOrders.length,
    readyCount: readyOrders.length,
  }

  return (
    <DashboardContent 
      user={user}
      profile={profile}
      business={business}
      orders={orders || []}
      stats={stats}
    />
  )
}
