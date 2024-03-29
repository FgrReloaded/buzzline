import initProfile from "@/lib/initial-profile"
import { db } from "@/lib/db";
import { redirect } from "next/navigation"
import InitialModal from "@/components/modals/InitialModal";

const SetupPage = async () => {
    const profile = await initProfile();
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })


    if (server) {
        return redirect(`/server/${server.id}`)
    }

    return <>
        <InitialModal />
    </>
}

export default SetupPage