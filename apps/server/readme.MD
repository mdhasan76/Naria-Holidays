## API Documentation

# Task API Documentation

## Base URL:

```
https://naria-server-j1ppm46wl-mdhasan76s-projects.vercel.app/
```

## Authentication Endpoints

### 1. **POST /auth/register**

Register a new user.

- **Method**: `POST`
- **URL**: `/auth/register`
- **Request Body** (JSON):
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "displayImage": "string"
  }
  ```
- **Response**:
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Validation failed.

### 2. **POST /auth/login**

Log in a user.

- **Method**: `POST`
- **URL**: `/auth/login`
- **Request Body** (JSON):
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK`: Login successful.
  - `401 Unauthorized`: Invalid credentials.

### 3. **GET /auth/profile**

Get the profile of the authenticated user.

- **Method**: `GET`
- **URL**: `/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`: Returns the user profile.
  - `401 Unauthorized`: Missing or invalid token.

### 4. **PUT /auth/profile**

Update the authenticated user's profile.

- **Method**: `PUT`
- **URL**: `/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (JSON):
  ```json
  {
    "username": "string",
    "email": "string"
  }
  ```
- **Response**:
  - `200 OK`: Profile updated successfully.
  - `400 Bad Request`: Validation failed.

### 5. **POST /auth/forgot-password**

Send a password reset link via email.

- **Method**: `POST`
- **URL**: `/auth/forgot-password`
- **Request Body** (JSON):
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  - `200 OK`: Password reset link sent.
  - `400 Bad Request`: Validation failed.

### 6. **POST /auth/reset-password**

Reset the password using a reset token.

- **Method**: `POST`
- **URL**: `/auth/reset-password`
- **Request Body** (JSON):
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  - `200 OK`: Password reset successfully.
  - `400 Bad Request`: Validation failed.

### 7. **POST /auth/logout**

Log out the authenticated user.

- **Method**: `POST`
- **URL**: `/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  - `200 OK`: Logged out successfully.
  - `401 Unauthorized`: Missing or invalid token.

### 8. **GET /auth/refresh-token**

Refresh the authentication token.

- **Method**: `GET`
- **URL**: `/auth/refresh-token`
- **Response**:
  - `200 OK`: Returns a new authentication token.
  - `401 Unauthorized`: Refresh token is invalid or expired.

---

# Task API Documentation

## Base URL:

```
https://naria-server-j1ppm46wl-mdhasan76s-projects.vercel.app/api/v1/tasks
```

Those api is Authenticate apis. Only Register user can access those route

## Endpoints:

### 1. **GET /tasks**

Retrieve a list of all tasks.

- **Method**: `GET`
- **URL**: `/tasks`
- **Response**:
  - `200 OK`: Returns an array of tasks.
  - Each task contains:
    ```json
    {
      "_id": "ObjectId",
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "pending | completed",
      "createdAt": "date-time",
      "updatedAt": "date-time"
    }
    ```

---

### 2. **GET /tasks/states**

Retrieve all possible task states.

- **Method**: `GET`
- **URL**: `/tasks/states`
- **Response**:

  - `200 OK`: Returns an array of task states.

    ```json

    "statusCode": 200,
    "success": true,
    "data": [
        {
            "name": "Total Task",
            "total": 4
        },
        {
            "name": "Pending",
            "total": 1
        },
        {
            "name": "Complete",
            "total": 3
        }
    ],
    "message": "Get Task States Successfully"

    ```

---

### 3. **GET /tasks/:id**

Retrieve details of a specific task by its ID.

- **Method**: `GET`
- **URL**: `/tasks/:id`
- **Parameters**:
  - `id` (string) – The unique identifier of the task.
- **Response**:
  - `200 OK`: Returns the task details.
  - `404 Not Found`: Task not found.

---

### 4. **POST /tasks**

Create a new task.

- **Method**: `POST`
- **URL**: `/tasks`
- **Request Body** (JSON):
  ```json
  {
    "title": "string",
    "description": "string",
    "dueDate": "string",
    "status": "pending | completed"
  }
  ```
- **Validation**:
  - `title`: Required, string.
  - `status`: Must be one of `pending` or `completed`.
- **Response**:
  - `201 Created`: Task created successfully.
  - `400 Bad Request`: Validation failed.

---

### 5. **PUT /tasks/:id**

Update an existing task by its ID.

- **Method**: `PUT`
- **URL**: `/tasks/:id`
- **Parameters**:
  - `id` (string) – The unique identifier of the task.
- **Request Body** (JSON):
  ```json
  {
    "title": "string",
    "description": "string",
    "status": "pending | completed"
  }
  ```
- **Response**:
  - `200 OK`: Task updated successfully.
  - `404 Not Found`: Task not found.
  - `400 Bad Request`: Validation failed.

---

### 6. **DELETE /tasks/:id**

Delete a task by its ID.

- **Method**: `DELETE`
- **URL**: `/tasks/:id`
- **Parameters**:
  - `id` (string) – The unique identifier of the task.
- **Response**:
  - `200 OK`: Task deleted successfully.
  - `404 Not Found`: Task not found.

---

```

```
