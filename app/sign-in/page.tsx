"use client"

import React, { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Alert, AlertDescription } from '@/components/ui/alert'
  import { Eye, EyeOff } from 'lucide-react' 
import { Label } from '@/components/ui/label'


function SignIn() {
    const [ emailAddress, setEmailAddress ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false);
    const [ error, setError ] = useState("")
    const { isLoaded, signIn, setActive} = useSignIn() // clerk docs return these
    const router = useRouter()
    
      if(!isLoaded) {
        return null;
      }

      async function submit(e: React.FormEvent) {
        e.preventDefault()

        if(!isLoaded) {
            return null;
        }

        try {
            const result = await signIn.create({
                identifier: emailAddress, password
            })

            console.log("Sign-in result:", result);

            if(result.status === "complete") {

                await setActive({session: result.createdSessionId})
                router.push("/dashboard") 
            } else {
                console.log(JSON.stringify(result, null, 2))
            }
        } catch (error: any) {
            console.log("Error", error.errors[0].message);
            setError(error.errors[0].message) // means grabbing message from first element i.e. active error
        }
      }
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold text-center'>Sign In to Todo Master</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className='space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor="email">Email</label>
                        <Input
                        type='email'
                        id='email'
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)} 
                        required
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='password'>Password</Label>
                        <div className='relative'>
                            <Input
                            type={showPassword ? "text" : "password"}
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                            <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-2 top-1/2 -translate-y-1/2'
                            >
                                {showPassword ? (
                                    <EyeOff className='h-4 w-4 text-gray-500'/>
                                ):(<Eye className='h-4 w-4 text-gray-500'/>)}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button type='submit' className='w-full'>
                      Sign In
                    </Button>
                </form>
            </CardContent>
            <CardFooter className='justify-center'>
                <p className='text-sm text-muted-foreground'>
                Don&apos;t have an account?{" "}
                <Link 
                href="/sign-up"
                className='font-medium text-primary hover:underline'>
                    Sign up
                </Link>
                </p>
            </CardFooter>
        </Card>
    </div>
  )
}

export default SignIn