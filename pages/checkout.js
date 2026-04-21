export class checkoutPage {
    constructor(page) {
        this.page = page;
        this.header = page.locator('[data-test="secondary-header"]');
        this.checkoutInformationForm = page.locator('#checkout_info_container');
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.errorMessage = page.locator('[data-test="error"]');
        this.subTotalLabel = page.locator('[data-test="subtotal-label"]');
        this.taxLabel = page.locator('[data-test="tax-label"]');
        this.totalLabel = page.locator('[data-test="total-label"]');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.checkoutCompleteLabel = page.locator('#checkout_complete_container');
    }

    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async fillCheckoutInformationWithEmptyFirstName(lastName, postalCode) {
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async fillCheckoutInformationWithEmptyLastName(firstName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.postalCodeInput.fill(postalCode);
    }

    async fillCheckoutInformationWithEmptyPostalCode(firstName, lastName) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
    }

    async continueCheckout() {
        await this.continueButton.click();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async getSubtotal() {
        const text = await this.subTotalLabel.textContent();
        return parseFloat(text.replace('Item total: $', ''));
    }

    async getTax() {
        const text = await this.taxLabel.textContent();
        return parseFloat(text.replace('Tax: $', ''));
    }

    async getTotal() {
        const text = await this.totalLabel.textContent();
        return parseFloat(text.replace('Total: $', ''));
    }
}