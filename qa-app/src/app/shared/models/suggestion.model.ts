export interface Suggestion {
    id?: string;
    questionId: string;
    suggestion: string;
    suggestedBy: string;
    suggestedDate: Date;
    accepted?: boolean;
}