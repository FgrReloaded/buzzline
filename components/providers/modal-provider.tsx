"use client"

import CreateServerModal from "@/components/modals/createServerModal"
import { useState, useEffect } from "react"
import InviteModal from "../modals/inviteModal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null;

    return (
        <div>
            <CreateServerModal />
            <InviteModal />
        </div>
    )
}

export default ModalProvider