import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";
import { Question } from "../models/question.model";

@Injectable()
export class QuestionAdapter implements Adapter<Question> {

    adapt(item: any): Question {
        let question = {
            id: item?.id,
            description: item?.description,
            categoryId: item?.categoryId,
            postedBy: item?.postedBy,
            acceptedAnswerId: item?.acceptedAnswerId,
            postedDate: item?.postedDate,
            updatedDate: item?.updatedDate
        } as Question;
        return question;
    }
    
}