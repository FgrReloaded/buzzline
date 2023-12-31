import { Menu } from 'lucide-react'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button'
import NavigationSidebar from './navigation/navigationSidebar'
import ServerSidebar from './server/serverSiderbar'

const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={'ghost'} className='md:hidden'>
                    <Menu className='h-5 w-5 text-zinc-500 dark:text-zinc-400' />
                </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className='p-0 flex gap-0'>
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    )
}

export default MobileToggle