# To-Do List SOAP Web Service

This project is a simple to-do list application that exposes a SOAP web service for managing user accounts and to-do items. It is built with Java and Spring Boot and uses an in-memory data store, so no database is required.

## Features

*   **User Registration:** New users can register with a username and password.
*   **User Login:** Registered users can log in to receive a session token.
*   **Private To-Do Lists:** Each user has their own private to-do list.
*   **CRUD Operations:** Users can create, retrieve, update, and delete their to-do items.

## Technologies Used

*   **Java 11**
*   **Spring Boot:** For creating the standalone web application.
*   **Spring Web Services:** For creating the SOAP web service.
*   **Maven:** For project management and dependencies.
*   **JAXB:** For generating Java classes from the XSD schema.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Java Development Kit (JDK) 11 or later
*   Apache Maven

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/your_repository.git
    cd your_repository
    ```

2.  **Build and run the application:**
    You can run the application using the Spring Boot Maven plugin:
    ```sh
    mvn spring-boot:run
    ```
    The application will start on `localhost:8081`.

## API Usage

You can interact with the SOAP web service by sending POST requests to `http://localhost:8081/ws`.

### 1. Register a New User

```bash
curl --location --request POST 'http://localhost:8081/ws' \\
--header 'Content-Type: text/xml' \\
--data-raw '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://todoapp.com/ws">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:registrationRequest>
         <ws:username>newuser</ws:username>
         <ws:password>password123</ws:password>
      </ws:registrationRequest>
   </soapenv:Body>
</soapenv:Envelope>'
```

### 2. Login to Get a Token

```bash
curl --location --request POST 'http://localhost:8081/ws' \\
--header 'Content-Type: text/xml' \\
--data-raw '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://todoapp.com/ws">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:loginRequest>
         <ws:username>newuser</ws:username>
         <ws:password>password123</ws:password>
      </ws:loginRequest>
   </soapenv:Body>
</soapenv:Envelope>'
```
**Note:** Replace the token in the following requests with the one you receive from the login response.

### 3. Add a To-Do Item

```bash
curl --location --request POST 'http://localhost:8081/ws' \\
--header 'Content-Type: text/xml' \\
--data-raw '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://todoapp.com/ws">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:addTodoRequest>
         <ws:token>YOUR_TOKEN_HERE</ws:token>
         <ws:task>My first todo</ws:task>
      </ws:addTodoRequest>
   </soapenv:Body>
</soapenv:Envelope>'
```

### 4. Get All To-Do Items

```bash
curl --location --request POST 'http://localhost:8081/ws' \\
--header 'Content-Type: text/xml' \\
--data-raw '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://todoapp.com/ws">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:getTodosRequest>
         <ws:token>YOUR_TOKEN_HERE</ws:token>
      </ws:getTodosRequest>
   </soapenv:Body>
</soapenv:Envelope>'
```

### 5. Update a To-Do Item

```bash
curl --location --request POST 'http://localhost:8081/ws' \\
--header 'Content-Type: text/xml' \\
--data-raw '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://todoapp.com/ws">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:updateTodoRequest>
         <ws:token>YOUR_TOKEN_HERE</ws:token>
         <ws:todo>
            <ws:id>1</ws:id>
            <ws:task>My updated todo</ws:task>
            <ws:done>true</ws:done>
         </ws:todo>
      </ws:updateTodoRequest>
   </soapenv:Body>
</soapenv:Envelope>'
```

### 6. Delete a To-Do Item

```bash
curl --location --request POST 'http://localhost:8081/ws' \\
--header 'Content-Type: text/xml' \\
--data-raw '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://todoapp.com/ws">
   <soapenv:Header/>
   <soapenv:Body>
      <ws:deleteTodoRequest>
         <ws:token>YOUR_TOKEN_HERE</ws:token>
         <ws:id>1</ws:id>
      </ws:deleteTodoRequest>
   </soapenv:Body>
</soapenv:Envelope>'
```