export interface Question {
    id?: string;
    description: string;
    categoryId: string;
    categoryName?: string;
    postedBy: string;
    acceptedAnswerId: string;
    postedDate: Date;
    updatedDate: Date;
}