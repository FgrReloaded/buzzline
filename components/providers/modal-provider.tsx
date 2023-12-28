"use client"

import CreateServerModal from "@/components/modals/createServerModal"
import { useState, useEffect } from "react"
import InviteModal from "../modals/inviteModal";
import EditServerModal from "../modals/editServerModal";
import ManageMemberModal from "../modals/manageMemberModal";
import CreateChannelModal from "../modals/createChannelModal";
import LeaveModal from "../modals/leaveModal";
import DeleteModal from "../modals/deleteModal";

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
            <EditServerModal/>
            <ManageMemberModal/>
            <CreateChannelModal />
            <LeaveModal/>
            <DeleteModal/>
        </div>
    )
}

export default ModalProvider