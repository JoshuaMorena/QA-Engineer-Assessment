export class cartPage {
    constructor(page) {
        this.page = page;
        this.header = page.locator('[data-test="secondary-header"]');
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async removeFromCart(productId) {
        const selector = `[data-test="remove-${productId}"]`;
        await this.page.locator(selector).click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}