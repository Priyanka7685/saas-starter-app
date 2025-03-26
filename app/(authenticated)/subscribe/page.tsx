"use client"

import {useRouter} from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

function SubscribePage() {
    const router = useRouter();
    const [loading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false) 
    const [subscriptionEnds, setSubscriptionEnds] = useState(false)

    // fetching subscription
    const fetchSubscriptionStatus = useCallback(async () => {
         setIsLoading(true)
         try {
            const response = await fetch(`/api/subscription`)

            if(response.ok) {
                const data = await response.json()
                setIsSubscribed(data.isSubscribed)
                setSubscriptionEnds(data.subscriptionEnds)
            } else {
            throw new Error("Failed to fetch subscription")
            }
            
         } catch (error) {
            throw new Error("Failed to fetch subscription")
            console.log(error);
         } finally {
            setIsLoading(false)
         }
    },[])

    useEffect(() => {
        fetchSubscriptionStatus()
    },[fetchSubscriptionStatus])

    // handling subscription
    const handleSubscribe = async(id: string) => {
        try {
            const response = await fetch("/api/subscription", {
                method: "POST",
            })
    
            if(response.ok) {
                const data = await response.json()
                setIsSubscribed(data.isSubscribed)
                setSubscriptionEnds(data.subscriptionEnds)
                router.refresh()
            } else {
                throw new Error("Failed to handle subscription")
            }
        } catch (error) {
            console.log(error);
            
        }
    }

  return (
    <div>SubscribePage</div>
  )
}

export default SubscribePage