import { ReactNode } from "react";

export interface Reward {
    id: number;
    name: string;
    description: string;
    points: number;
    icon: ReactNode;
    available: boolean;
}