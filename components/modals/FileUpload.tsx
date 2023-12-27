import React from 'react'
import { UploadDropzone } from '@/lib/uploadThing';
import "@uploadthing/react/styles.css";
import { X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
    const fileType = value?.split(".").pop();
    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-32 w-32">
                <Image alt='img' src={value} fill layout="fill" objectFit="contain" className='rounded-full' />
                <button className="absolute  rounded-sm top-0 right-0" onClick={() => onChange(undefined)}>
                    <X size={20} />
                </button>
            </div>
        )
    }

    
    return (
        <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
        }}
            onUploadError={(err: Error) => {
                console.log(err);
            }}
        />

    )
}

export default FileUpload