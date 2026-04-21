import { PRODUCTS } from '../test-data/products';
import { faker } from '@faker-js/faker';

export class productPage {
    constructor(page) {
        this.page = page;
        this.header = page.locator('[data-test="secondary-header"]');
        this.inventoryLists = page.locator('[data-test="inventory-list"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }
    
    async addToCart(productId) {
        const selector = `[data-test="add-to-cart-${productId}"]`;
        await this.page.locator(selector).click();
    }

    async viewCart() {
        await this.cartIcon.click();
    }
    
    async checkout() {
        await this.checkoutButton.click();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }

    async addRandomItemAndNavigateToCheckout() {
        const randomProduct = faker.helpers.arrayElement(PRODUCTS);
        await this.addToCart(randomProduct.id);
        await this.viewCart();
        await this.checkout();
    }
}