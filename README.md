# Overview

This is my first full stack web application. It's such a fun time. The basic idea is for users to create an account and login to access their account. It's a single page application, in which there is an input page where users can enter a text file of their resume, and the text of a job description. That input will be inserted into a prompt that will then be sent off to the OpenAI chat API endpoint. The prompt asks chatgpt to create a tailored resume and a cover letter for the application, and to make an assessment of whether or not the user is a good fit for the role described absed on the information in their resume, and to make suggestions for filling knowledge, skill or cerification gaps. The documents the AI generate are then stored in a database, in association with the user. Those history items then populate a history sidebar, from which individual items can be selected for later review- maybe the applicant gets an interview and would like to look back on the job application. I should also include an view for the actual job description but at the time of writing have not. 

## on the docket

This functionality is rudimentary and unimpressive. I'l give myself the credit of starting relatively close to ground level on this application, it being my first web application and all.... But it's probably not even really that useful to anyone, considering the output to the user is currently unformatted text- a shortcoming I intend on remediating. Also, the application itself is insecure.

File handling: I feel almost embarrassed that the only capability thus far is .txt files and a text box. common files that people store resumes in would be more ideal - pdf, doc.

Session management: currently, users are logged out on refresh. I am currently working on fixing this problem by implementing session cookies. 

Accessability: layout and design, particularly the output as seen by users - as it's currently pretty ugly. I think what would be best would be to output a word doc formatted to a template to the user.

Security:  Protections against injection, XSS, and a variety of other attacks should definitely be implemented. I would also like to implement a regex check on input data for sensitive information- phone numbers, email addresses, links - so I can replace it with placeholders instead of passing people's personal information to the openAI API.

Future functionality: I think what would be much cooler than what I have going on is to use a variety of other APIs to render a digital "mock interviewer" avatar with which a user can get practice interviewing for any given job, using the job description and resume as context.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
