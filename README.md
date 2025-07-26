# What does a ___ do?

A multi language interactive word association game powered by Google's Gemini AI. This project features a Java Spring Boot backend and a dynamic vanilla JavaScript frontend, all containerized for easy setup with Docker.

---

## 🌎 Supported Languages

The game currently supports the following languages:

* English
* German
* Czech

## ⚙️ How the Game Works

The game follows a simple but powerful flow to create a dynamic and responsive user experience.

1.  **Word Presentation:** The game begins by presenting the user with a noun.
2.  **User Input:** The user submits a verb they believe is associated with the noun.
3.  **Backend Request:** The frontend sends the noun-verb pair to the Java Spring Boot backend.
4.  **Cache Check:** The application first queries its PostgreSQL database to see if this exact noun-verb pair has been submitted before.
    -   **Cache Hit:** If the pair exists, the previously generated AI response is retrieved from the database and immediately sent back to the user. This ensures fast performance and minimizes redundant API calls.
    -   **Cache Miss:** If the pair is new, the application proceeds to the next step.
5.  **AI Evaluation:** The backend calls the Google Gemini API (`gemini-2.5-flash-lite` model), asking it to evaluate if the verb is a logical action for the noun and to generate a witty response.
6.  **Response Handling:** The AI's response is sent back to the user. If the answer was deemed logical, the AI's remark includes a transition to the next word. If not, the game ends with a mocking comment.
7.  **Cache Update:** The new AI-generated response is saved to the PostgreSQL database to be used for future cache hits.

---

## 🛠️ Technology Stack

| Component      | Technology                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| **Backend** | [Java 21](https://www.java.com), [Spring Boot](https://spring.io/projects/spring-boot)                        |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript                                                                               |
| **Database** | [PostgreSQL](https://www.postgresql.org/) for response caching                                                |
| **AI Model** | [Google Gemini](https://ai.google.dev/) (`gemini-2.5-flash-lite`)                                             |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose                                                      |
| **Build Tool** | [Maven](https://maven.apache.org/)                                                                            |

---

## 🚀 Getting Started (Local Development)

This project is fully containerized, allowing for a simple one-command setup.

### Prerequisites

-   Docker
-   Docker Compose

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/wolftxt/Verb-word-game.git
    ```
    ```sh
    cd Verb-word-game
    ```

2.  **Create an environment file:**
    Create a file named `.env` in the root of the project directory.

3.  **Add environment variables:**
    Open the `.env` file and add your credentials. The `docker-compose.yml` is configured to use these variables to set up the database and provide the API key to the Spring application.
    ```env
    GEMINI_API_KEY="your_gemini_api_key"
    DB_PASSWORD="your_password"
    DB_HOST="db"
    DB_PORT="5432"
    DB_NAME="VerbsDB"
    DB_USERNAME="postgres"
    ```

4.  **Launch the application:**
    Run the following command from the project root. Docker Compose will build the images and start the Java application and its PostgreSQL database.
    ```sh
    docker compose up
    ```

The application will be available at `http://localhost:8080`.
