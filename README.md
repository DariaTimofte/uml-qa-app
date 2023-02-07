# uml-qa-app
Q&amp;A Angular app with Firebase implementantions (Authentications, Firestore Database, Hosting).

A Question-Answer platform allowing users to ask questions and receive answers or suggestions, activities that ultimately lead to them winning badges.

### Application flows
- Authentication - Login/Register (Google or Email/Password) + Change password + Logout
- Landing page 
    - Ask Question + Add Category
    - View latest questions - Answer question; Suggest edit + View Answers (route to Answers page)
    - Browse questions - route to Questions page
- Questions page 
    - View answers - route to Answers page
    - Answer question
    - Suggest edit
- Answers page
    - UpVote/DownVote answer
- Profile page
    - Your Questions - Edit/Delete + Accept answer/suggestion + View answers
    - Your Answers - Edit/Delete
    - Your Badges - Receive badges based on the following criteria:
        - Post at least 3 questions
        - Answer at least 10 questions
        - Suggest at least 2 edits
        - Own at least 5 accepted answers

### Design patterns

- Singleton -> singleton service
    - referenced through setting the `providedIn: "root"` property on the `@Injectable` decorator of the service class
        - qa-app/src/app/shared/services/auth.service.ts `AuthenticationService`
        - qa-app/src/app/shared/services/user.service.ts `UserService`
- Model - Adapter
    - we use the adapter to convert the API's response to an object (model) defined by us
        - qa-app/src/app/shared/adapters/adapter.ts `Adapter` - generic interface
        - qa-app/src/app/shared/adapters/question.adapter.ts `QuestionAdapter` - Adapter implementation for our custom Questions class
        - qa-app/src/app/shared/services/question.service.ts `QuestionService` `getLatestQuestions()` - mapping the result received from the API to the desired object type using the `adapt()` method

> App can be accessed directly through this link: [Q&A app URL]

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Q&A app URL]: <https://uml-project-57184.firebaseapp.com/>
