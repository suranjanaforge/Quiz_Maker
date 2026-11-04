# Quiz Maker – JavaScript

An interactive, subject-wise Quiz Maker built using **HTML, CSS, and JavaScript**. The application allows users to register, generate quizzes from a JSON-based question bank, attempt questions within a specified time limit, and receive their results via email.

## Features

- **User Registration & Login:** Users can create an account using their email address.
- **Subject Selection:** Choose from three available subjects. The subjects can be customized by modifying the project data.
- **Dynamic Question Generation:** Questions are fetched from a JSON file, and the number of questions generated depends on the time allocated for the quiz.
- **Interactive Quiz Interface:** Questions are displayed on the right panel, while the left panel provides an overview of all questions.
- **Question Tracking:** Attempted questions are highlighted in green on the navigation panel, while unanswered questions remain uncolored.
- **Live Countdown Timer:** A timer tracks the available time based on the allocated duration per question.
- **Automated Result Emails:** Once the quiz is completed, the user's result is sent to their registered email address using an API integration.

## How It Works

1. **Register/Login:** Users create an account with their email address.
2. **Select a Subject:** Choose the subject for the quiz.
3. **Generate Quiz:** The application retrieves questions from the JSON question bank according to the selected time limit.
4. **Attempt Questions:** Answer questions using the interactive quiz interface. The navigation panel tracks attempted and unanswered questions.
5. **Track Time:** A countdown timer helps users manage their time while attempting the quiz.
6. **Receive Results:** After completion, the quiz result is emailed to the user's registered email address.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- JSON (Question Bank)
- API Integration (Email Delivery)

## Project Structure

```text
Quiz-Maker/
│
├── index.html
├── style.css
├── script.js
├── questions.json
└── README.md
```

*Note: The file structure above is indicative. Adjust it according to your actual project files.*

## Customization

The project is designed to be customizable:

- Add or remove subjects.
- Update the JSON question bank with new questions.
- Modify quiz duration and time allocation.
- Customize the quiz interface and styling.

The question bank makes it easy to expand the application without having to manually add every question to the JavaScript code.

## Learning Outcomes

Building this project helped me understand the fundamentals of JavaScript and how it can be used to create dynamic and interactive web applications.

Some of the key concepts I explored include:

- DOM manipulation and event handling.
- Fetching and processing JSON data.
- Dynamically generating HTML elements.
- Managing timers and countdown functionality.
- Tracking user interactions and quiz progress.
- Working with APIs for email integration.
- Implementing basic user registration and login flows.

## Future Improvements

- Add more subjects and difficulty levels.
- Introduce randomized question selection.
- Add negative marking and performance analytics.
- Maintain user quiz history and scores.
- Improve authentication and account management.

---

**Developed as a learning project to explore JavaScript, dynamic content generation, JSON handling, and API integration.**
