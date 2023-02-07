export interface Answer {
    id?: string;
    questionId: string;
    description: string;
    postedBy: string;
    accepted: boolean;
    answeredDate: Date;
    votes: number;
    updatedDate?: Date;
}