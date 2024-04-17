import { ParticipantType } from "./Participant";

export const month = [
    'january',
    'february',
    'martch',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
]

export interface EventType {
    id: number;
    name: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    participants: ParticipantType[]
}