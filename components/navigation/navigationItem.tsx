"use client"

import React from 'react';
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils'
import ActionTooltip from '../modals/action-tooltips';

interface NavigationItemProps {
    id: string;
    name: string;
    icon: string;
}

const NavigationItem = ({
    id,
    name,
    icon
}: NavigationItemProps) => {
    const { serverId } = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/server/${id}`)
    }

    return (
        <ActionTooltip label={name} side='right' align='center'>
            <button onClick={onClick} className='group relative flex items-center'>
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    serverId !== id && "group-hover:h-[20px]",
                    serverId === id ? "h-[36px]": "h-[8px]"
                )}/>
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    serverId === id && "bg-primary/10 text-primary rounded-[16px]",
                )}>
                    <Image fill src={icon} alt='server' />

                </div>
            </button>
        </ActionTooltip>
    )
}

export default NavigationItem