"use client"

import { BackButton } from '@/components/BackButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import {useRouter} from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

function SubscribePage() {
    const router = useRouter();
    const [loading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false) 
    const [subscriptionEnds, setSubscriptionEnds] = useState<string | null>(null)

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
            toast({
                title: "Error",
                description: "Failed to fetch subscription status. Please try again.",
                variant: "destructive",
              });
         } finally {
            setIsLoading(false)
         }
    },[toast])

    useEffect(() => {
        fetchSubscriptionStatus()
    },[fetchSubscriptionStatus])

    // handling subscription
    const handleSubscribe = async() => {
        try {
            const response = await fetch("/api/subscription", {
                method: "POST",
            })
    
            if(response.ok) {
                const data = await response.json()
                setIsSubscribed(data.isSubscribed)
                setSubscriptionEnds(data.subscriptionEnds)
                router.refresh()
                toast({
                    title: "Success",
                    description: "You have successfully subscribed!",
                  });
            } else {
                const errorData = await response.json();
                throw new Error("Failed to handle subscription")
            }
        } catch (error) {
            toast({
                title: "Error",
                description:
                  error instanceof Error
                    ? error.message
                    : "An error occurred while subscribing. Please try again.",
                variant: "destructive",
              });
            
        }
    }
    if (loading) {
        return <div className="flex justify-center items-center">Loading...</div>;
      }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8 text-center">Subscription</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubscribed ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You are a subscribed user. Subscription ends on{" "}
                {new Date(subscriptionEnds!).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You are not currently subscribed. Subscribe now to unlock all
                  features!
                </AlertDescription>
              </Alert>
              <Button onClick={handleSubscribe} className="mt-4">
                Subscribe Now
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SubscribePage