describe('XSS Tests', () => {
    it('should reflect XSS payload in the search page', () => {
        const xssPayload = '<script>window.alert("XSS")</script>';

        // Set up a spy on window.alert
        // We need to visit the page with the payload, but standard cy.visit 
        // with the payload in the URL might trigger the alert before Cypress can spy on it 
        // depending on how the browser handles it.
        // However, here we are testing reflected XSS via a form submission or URL parameter.

        // Approach 1: Visit page then submit form
        cy.visit('/search');

        // Stub the window.alert method
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        // Type the payload
        cy.get('input[name="q"]').type(xssPayload);
        cy.contains('button', 'Search').click();

        // Check if the payload text exists in the page (confirming reflection)
        // Since the script might execute, we check for its presence in the DOM or its effect.
        // Note: Browsers like Chrome have XSS auditors that might block this, 
        // but modern Chrome doesn't filtering reflected XSS by default in the same way old ones did.
        // However, Cypress runs in the browser. 

        // To verify XSS execution reliably in a test, we often look for the side effect (the alert).
        // Since the vulnerability is raw HTML reflection:
        // The server sends back: ... <b><script>...</script></b> ...

        // We assert that the alert was called.
        // Note: <script> tags inserted via innerHTML or similar often don't execute.
        // But since this is server-side rendering, the browser parses the initial HTML and WILL execute it.

        // We need to listen for the alert on the *new* page load.
        // cy.on('window:alert') binds to the *current* window. When the form submits, 
        // a new page loads. We might miss it.

        // Better approach for Reflected XSS via URL:
        cy.visit('/search?q=' + encodeURIComponent(xssPayload), {
            onBeforeLoad(win) {
                cy.stub(win, 'alert').as('alertStub');
            }
        });

        // Verify the alert was called
        cy.get('@alertStub').should('have.been.calledWith', 'XSS');
    });
});
