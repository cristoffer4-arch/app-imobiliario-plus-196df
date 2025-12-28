// Area Notifications System
// Alerts users when new properties are added to their saved areas

import { createClient } from '@/lib/supabase/client'
import { isPointInPolygon } from '@/lib/saved-areas'

export interface AreaNotification {
  id: string
  userId: string
  areaId: string
  areaName: string
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  propertyAddress: string
  propertyImage?: string
  createdAt: string
  read: boolean
}

export interface NotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  notifyNewProperties: boolean
  notifyPriceChanges: boolean
  notifyStatusChanges: boolean
  digestFrequency: 'instant' | 'daily' | 'weekly' | 'none'
}

/**
 * Check if a new property falls within any saved areas and create notifications
 */
export async function checkAndCreateNotifications(
  propertyId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  const supabase = createClient()
  
  // Get all saved areas
  const { data: areas, error: areasError } = await supabase
    .from('saved_areas')
    .select('*')
  
  if (areasError || !areas) {
    console.error('Error fetching saved areas:', areasError)
    return
  }
  
  // Get property details
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id, title, price, address, images')
    .eq('id', propertyId)
    .single()
  
  if (propertyError || !property) {
    console.error('Error fetching property:', propertyError)
    return
  }
  
  // Check each area to see if property is within it
  for (const area of areas) {
    const coordinates = area.coordinates as [number, number][]
    const point = { lng: longitude, lat: latitude }
    
    if (isPointInPolygon(point, coordinates)) {
      // Property is in this area, create notification
      await createNotification(
        area.user_id,
        area.id,
        area.name,
        property.id,
        property.title,
        property.price,
        property.address,
        property.images?.[0]
      )
    }
  }
}

/**
 * Create a notification for a user
 */
async function createNotification(
  userId: string,
  areaId: string,
  areaName: string,
  propertyId: string,
  propertyTitle: string,
  propertyPrice: number,
  propertyAddress: string,
  propertyImage?: string
): Promise<void> {
  const supabase = createClient()
  
  // Check user preferences first
  const preferences = await getNotificationPreferences(userId)
  if (!preferences.notifyNewProperties) {
    return // User has disabled new property notifications
  }
  
  const { error } = await supabase
    .from('area_notifications')
    .insert({
      user_id: userId,
      area_id: areaId,
      area_name: areaName,
      property_id: propertyId,
      property_title: propertyTitle,
      property_price: propertyPrice,
      property_address: propertyAddress,
      property_image: propertyImage,
      read: false
    })
  
  if (error) {
    console.error('Error creating notification:', error)
    return
  }
  
  // Send email/push notification if enabled
  if (preferences.emailNotifications && preferences.digestFrequency === 'instant') {
    await sendEmailNotification(userId, areaName, propertyTitle, propertyAddress)
  }
  
  if (preferences.pushNotifications) {
    await sendPushNotification(userId, areaName, propertyTitle)
  }
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error || !data) {
    // Return defaults if no preferences set
    return {
      emailNotifications: true,
      pushNotifications: false,
      notifyNewProperties: true,
      notifyPriceChanges: true,
      notifyStatusChanges: true,
      digestFrequency: 'instant'
    }
  }
  
  return {
    emailNotifications: data.email_notifications,
    pushNotifications: data.push_notifications,
    notifyNewProperties: data.notify_new_properties,
    notifyPriceChanges: data.notify_price_changes,
    notifyStatusChanges: data.notify_status_changes,
    digestFrequency: data.digest_frequency
  }
}

/**
 * Update user's notification preferences
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<boolean> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: user.id,
      email_notifications: preferences.emailNotifications,
      push_notifications: preferences.pushNotifications,
      notify_new_properties: preferences.notifyNewProperties,
      notify_price_changes: preferences.notifyPriceChanges,
      notify_status_changes: preferences.notifyStatusChanges,
      digest_frequency: preferences.digestFrequency
    })
  
  if (error) {
    console.error('Error updating notification preferences:', error)
    return false
  }
  
  return true
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<AreaNotification[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  let query = supabase
    .from('area_notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (unreadOnly) {
    query = query.eq('read', false)
  }
  
  const { data, error } = await query
  
  if (error || !data) {
    console.error('Error fetching notifications:', error)
    return []
  }
  
  return data.map(notification => ({
    id: notification.id,
    userId: notification.user_id,
    areaId: notification.area_id,
    areaName: notification.area_name,
    propertyId: notification.property_id,
    propertyTitle: notification.property_title,
    propertyPrice: notification.property_price,
    propertyAddress: notification.property_address,
    propertyImage: notification.property_image,
    createdAt: notification.created_at,
    read: notification.read
  }))
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('area_notifications')
    .update({ read: true })
    .eq('id', notificationId)
  
  if (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
  
  return true
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { error } = await supabase
    .from('area_notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)
  
  if (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
  
  return true
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('area_notifications')
    .delete()
    .eq('id', notificationId)
  
  if (error) {
    console.error('Error deleting notification:', error)
    return false
  }
  
  return true
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return 0
  }
  
  const { count, error } = await supabase
    .from('area_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)
  
  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
  
  return count || 0
}

// Helper functions for sending notifications
async function sendEmailNotification(
  userId: string,
  areaName: string,
  propertyTitle: string,
  propertyAddress: string
): Promise<void> {
  // Implementation would connect to email service (e.g., SendGrid, Resend)
  console.log(`Email notification: New property "${propertyTitle}" in ${areaName}`)
  
  // Example implementation:
  // const supabase = createClient()
  // const { data: user } = await supabase.auth.getUser()
  // 
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     to: user.email,
  //     subject: `New Property in ${areaName}`,
  //     html: `<p>A new property has been listed in your saved area:</p>
  //            <h3>${propertyTitle}</h3>
  //            <p>${propertyAddress}</p>`
  //   })
  // })
}

async function sendPushNotification(
  userId: string,
  areaName: string,
  propertyTitle: string
): Promise<void> {
  // Implementation would use Web Push API or service like OneSignal
  console.log(`Push notification: New property "${propertyTitle}" in ${areaName}`)
  
  // Example implementation:
  // if ('serviceWorker' in navigator && 'PushManager' in window) {
  //   const registration = await navigator.serviceWorker.ready
  //   await registration.showNotification(`New Property in ${areaName}`, {
  //     body: propertyTitle,
  //     icon: '/icon.png',
  //     badge: '/badge.png',
  //     tag: 'new-property'
  //   })
  // }
}
