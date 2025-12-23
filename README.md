# Cypress Security Testing Demo: SQL Injection & XSS

This project demonstrates how to use **Cypress** to automate the detection of critical web application vulnerabilities: **SQL Injection (SQLi)** and **Cross-Site Scripting (XSS)**.


## 🚀 Why This Project Matters

In modern software development, security cannot be an afterthought. Integrating security testing into your automated test suite (DevSecOps) allows you to:
- **Shift Left**: Catch vulnerabilities early in the development cycle, before they reach production.
- **Prevent Regressions**: Ensure that fixed security bugs do not reappear in future builds.
- **Educate Developers**: Provide clear, executable examples of how vulnerabilities manifest and how they can be exploited.

This project serves as a practical playground to understand how these exploits work and how to write automated tests to verify them.

## 🛠️ How It Works From Scratch

This project is a self-contained environment consisting of a vulnerable web server and a Cypress test suite.

### 1. The Vulnerable Application (`server.js`)
We built a simple **Node.js/Express** application with an in-memory **SQLite** database.
- **SQL Injection Endpoint (`/login`)**: The application constructs a SQL query by directly concatenating user input without sanitization.
    ```javascript
    // BAD PRACTICE: Vulnerable to SQLi
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    ```
- **XSS Endpoint (`/search`)**: The application reflects user input from the query string directly into the HTML response.
    ```javascript
    // BAD PRACTICE: Vulnerable to Reflected XSS
    res.send(`... <p>You searched for: <b>${query}</b></p> ...`);
    ```

### 2. The Automated Tests (Cypress)
We use Cypress not just for UI testing, but to simulate malicious attacks.
- **`sqli.cy.js`**: Injects a payload (`' OR '1'='1`) into the login form. This manipulates the SQL query to always evaluate to true, allowing us to log in as the administrator without a password.
- **`xss.cy.js`**: Injects a malicious script tag (`<script>...`) into the search field and verifies that the browser executes it (by spying on the `window.alert` function).

## 🏃‍♂️ How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Vulnerable Server**:
    ```bash
    node server.js
    ```
    The app will be available at [http://localhost:3000].

3.  **Run the Security Tests**:
    Open a new terminal and run:
    ```bash
    npx cypress run
    ```
    You will see Cypress execute the attacks and verify the successful exploitation of the vulnerabilities.

## 👨‍💻 Author

**Saran Kumar**
