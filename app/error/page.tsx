"use client"

import { useRouter } from "next/router"
import { useEffect } from "react";

export default function ErrorPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/")
        }, 5000)

        return () => clearTimeout(timer)
    })
}