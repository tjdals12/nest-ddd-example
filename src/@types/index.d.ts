import 'express';

declare module 'express' {
    interface User {
        userId: string;
        userName: string;
    }

    interface Request {
        user?: User | undefined;
    }
}

// declare module Express {
//     interface User {
//         userId: string;
//         userName: string;
//     }

//     interface Request {
//         user?: User | undefined;
//     }
// }
