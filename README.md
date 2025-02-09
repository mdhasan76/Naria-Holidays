# Naria Holidays Task Management Site

**GitHub Repository:** [Naria Holidays](https://github.com/mdhasan76/Naria-Holidays)  
**Live Site:** [https://naria-holidays.netlify.app/](https://naria-holidays.netlify.app/)  
**Live Server:** [https://naria-server-j1ppm46wl-mdhasan76s-projects.vercel.app/](https://naria-server-j1ppm46wl-mdhasan76s-projects.vercel.app/)

---

## Tech Stack

**Frontend:** Next.js, Redux, React Hook Form, Tailwind CSS, Flowbite Component Library, Headless UI, TypeScript, React hot toast
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Nodemon, Zod, Bcrypt, JWT, Winston for Logging  
**Deployment:** Frontend on Netlify, Backend on Vercel

---

## Project Setup

### Steps to Run the Project Locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/mdhasan76/Naria-Holidays
   ```
2. Navigate to the project directory:
   ```bash
   cd naria-holidays
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

---

## Login Credentials

You can use the following credentials to log in:

- **Email:** `nayeem@gmail.com`
- **Password:** `hasanBhai22`

Alternatively, you can register using the registration form.

### Checking Emails

Emails sent by the application can be viewed on Ethereal Mail.

1. Go to [https://ethereal.email/login](https://ethereal.email/login)
2. Use the following credentials to log in:

   - **Email:** `cornell.stracke83@ethereal.email`
   - **Password:** `m7Ets8UNBdUD9E5CVQ`

3. Navigate to the "Messages" menu to see all emails.

---

## Authentication Process

User authentication is managed using **JWT tokens** on the backend. The tokens are verified through the `Authorization` header in API requests.

For security, tokens are stored in **HTTP-only cookies**, preventing potential **Cross-Site Scripting (XSS)** attacks. These cookies are not accessible via JavaScript.

The following tokens are used in the authentication process:

- **raw_idToken**: Contains the encrypted user object, secured with JWT.
- **accessToken**: Used for authentication and validating user sessions.
- **refreshToken**: Used to refresh the access token when it expires.

Storing tokens in HTTP-only cookies significantly reduces the risk of security vulnerabilities like XSS attacks.

---

## If you have any questions or face any trouble running the project, please let me know.
