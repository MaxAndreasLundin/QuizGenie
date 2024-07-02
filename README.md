# Overview

QuizGenie allows users to generate quizzes based on text provided directly or by scraping text from a webpage URL. The application currently supports two main endpoints.

## Endpoints

- POST /text
- POST /url

### 1. POST /text

This endpoint accepts a JSON object containing text data. It generates a quiz based on the provided text.

- **Request URL:** `http://localhost:3000/text`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**

  ```json
  {
    "text": "Your text here"
  }
  ```

- **Response:**
  ```json {
  "quiz": {
   "title": "Quiz Title",
   "questions": [
     {
       "question": "Question 1?",
       "answer": "Answer 1"
     },
     {
       "question": "Question 2?",
       "answer": "Answer 2"
     }
     // More questions...
   ]
  }
  }
  ```

### 1. POST /url

This endpoint accepts a JSON object containing a URL. It scrapes text content from the provided URL and generates a quiz based on the scraped text.

- **Request URL:** `http://localhost:3000/url`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**

  ```json
  {
    "url": "https://example.com/page"
  }
  ```

- **Response:**

  ```json {
  "quiz": {
    "title": "Quiz Title",
    "questions": [
      {
        "question": "Question 1?",
        "answer": "Answer 1"
      },
      {
        "question": "Question 2?",
        "answer": "Answer 2"
      }
      // More questions...
    ]
  }
  }

  ```

## Setup and Usage

### Clone the Repository

```sh
git clone https://github.com/yourusername/quizgenie.git
cd quizgenie
```

### Install Dependencies

You can use either Bun or npm to install dependencies.
Using Bun

```sh
bun install
```

Using npm

```sh
npm install
```

### Create a .env File

Create a .env file in the root directory with the following content:

```env
QUIZGENIE_OPENAI_API_KEY=your_openai_api_key
```

### Start the Server

Using Bun

```sh
bun start
```

Using npm

```sh
npm start
```

### Send Requests

Use a tool like curl, Postman, or any HTTP client to send POST requests to the endpoints.

Examples
POST /text Example

```sh
curl -X POST http://localhost:3000/text \
 -H "Content-Type: application/json" \
 -d '{
"text": "Volvo CE is a leading international manufacturer of premium construction equipment..."
}'
```

POST /url Example

```sh
curl -X POST http://localhost:3000/url \
 -H "Content-Type: application/json" \
 -d '{
"url": "https://en.wikipedia.org/wiki/Volvo_Construction_Equipment"
}'
```

### Notes

    Ensure the text provided is substantial enough for quiz generation.
    For the /url endpoint, the scraper targets common content elements to work across various websites.
