"use client"

import { Todo, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

interface UserWithTodos extends User {
    todos: Todo[];
}

export default function AdminDashboard() {
    const [email, setEmail] = useState("")
    const [debounceEmail, setDebounceEmail] = useDebounceValue("", 300)
    const [loading, setIsLoading] = useState(false)
    const [user, setUser] = useState<UserWithTodos | null>(null)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)


    // fetching user data
    const fetchUserData = useCallback(async (page: number) => {
        setIsLoading(true)

        try {
            const response = await fetch(`/api/admin?email?${debounceEmail}&page=${page}`);

            if(!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await response.json()
            setUser(data.user)
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (error) {
            throw new Error("Failed to fetch user data")
        } finally {
            setIsLoading(false)
        }
    },[debounceEmail])

    useEffect(() => {
        if(debounceEmail) {
            fetchUserData(1)
        }
    },[debounceEmail, fetchUserData])


    // handling search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setDebounceEmail(email)
    }

    // handling update subscription
    const handleUpdateSubscription = async () => {
        try {
            const response = await fetch(`/api/admin`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: debounceEmail,
                    isSubscribed: !user?.isSubscribed,
                })
            })
            if (!response.ok) throw new Error("Failed to update subscription");
        } catch (error) {
            throw new Error("Failed to update subscription")
        }
    }

    // handling update todo
    const handleUpdateTodo = async (id: string, completed: boolean) => {
        try {
            const response = await fetch("/api/admin", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: debounceEmail,
                    todoId: id,
                    todoCompleted: completed,
                })
            }) 
            if (!response.ok) throw new Error("Failed to update todo");
            fetchUserData(currentPage);
        } catch (error) {
            throw new Error("Failed to update todo")
        }
    }

    // handling delete todo
    const handleDeleteTodo = async (id:string) => {
        try {
            const response = await fetch("/api/admin", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({todoId: id})
            })
            if (!response.ok) throw new Error("Failed to update todo");
        } catch (error) {
            throw new Error("Failed to delete todo")
        }
    }
}