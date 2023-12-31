import {Server as NetServer} from 'http';
import { NextApiRequest } from 'next';
import {Server as ServerIO} from 'socket.io';

import { NextApiResponseServerIo } from '@/types';

export const config = {
    api: {
        bodyParser: false,
    }
}

const isHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
   /* This code block is checking if the `io` property exists on the `res.socket.server` object. If it
   does not exist, it creates a new instance of `ServerIO` and assigns it to the `io` property of
   `res.socket.server`. */
    if(!res.socket.server.io) {
        const path = '/api/socket/io';  
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

    }
    res.end();
}

export default isHandler;