export type ActionData = { message: string } | undefined;

export interface Comment {
    _id: string;
    body: string;
    author: {
        _id: string;
        username: string
    },
    createdAt: string;
}

export interface Post {
    _id: string;
    title: string;
    link?: string;
    body?: string;
    author: {
        _id: string;
        username: string
    }
    createdAt: string;
    comments?: Comment[];
    score: number;
}

export interface User {
    _id: string;
    username: string;
    password?: string;
    email?: string;
    confirmed?: boolean;
}