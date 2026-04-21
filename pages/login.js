import 'dotenv/config';

export class loginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }
    // Login as a standard user
    async loginAsUser() {
        await this.page.goto(process.env.SAUCEDEMO_URL, { waitUntil: 'domcontentloaded' });
        await this.usernameInput.fill(process.env.SAUCEDEMO_USERNAME);
        await this.passwordInput.fill(process.env.SAUCEDEMO_PASSWORD);
        await this.loginButton.click();

        await this.page.waitForURL(/.*inventory.html/); 
    
        await this.page.context().storageState({ path: 'test-data/auth.json' });
    }
}