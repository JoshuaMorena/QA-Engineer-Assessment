import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { productPage } from '../pages/product';
import { cartPage } from '../pages/cart';
import { checkoutPage } from '../pages/checkout';
import { PRODUCTS } from '../test-data/products';

test.describe('Add/Remove from Cart Functionality', () => {
    let product;
    let cart;
    let checkout;

    test.beforeEach(async ({ page }) => {
        product = new productPage(page);
        cart = new cartPage(page);
        checkout = new checkoutPage(page);
        await page.goto(`${process.env.SAUCEDEMO_URL}/inventory.html`);
    });

    test('Product Page Displays Correctly', async ({ page }) => {
        await expect(product.header).toContainText('Products');
        await expect(product.inventoryLists).toBeVisible();
    });

    test('TC-002: Add a Single Product to Cart - Verify Cart Badge Count', async ({ page }) => {
        const randomProduct = faker.helpers.arrayElement(PRODUCTS);
        console.log(`Adding product: ${randomProduct.name} to cart`);
        await product.addToCart(randomProduct.id);
        await expect(product.cartBadge).toHaveText('1');
    });

    test('TC-003: Add Multiple Products to Cart - Verify Cart Badge Count', async ({ page }) => {
        const randomProducts = faker.helpers.arrayElements(PRODUCTS, { min: 2, max: 6 });

        for (const item of randomProducts) {
            console.log(`Adding product: ${item.name} to cart`);
            await product.addToCart(item.id);
        }

        await expect(product.cartBadge).toHaveText(randomProducts.length.toString());
    });

    test('TC-004: Verify Cart Item Display', async ({ page }) => {
        const randomProducts = faker.helpers.arrayElements(PRODUCTS, { min: 2, max: 6 });

        for (const item of randomProducts) {
            console.log(`Adding product: ${item.name} to cart`);
            await product.addToCart(item.id);
        }
        await product.viewCart();
        await expect(cart.header).toContainText('Your Cart');

        for (const item of randomProducts) {
            const cartItemName = cart.cartItemNames.filter({ hasText: item.name });
            await expect(cartItemName).toBeVisible();
        }
    });

    test('TC-005: View Cart Contents Without Adding Products to Cart', async ({ page }) => {
        await product.viewCart();
        await expect(cart.header).toContainText('Your Cart');
        await expect(cart.cartItems).not.toBeVisible();
    });

    test('TC-006: Remove Product from Cart - Verify Cart Badge Count', async ({ page }) => {
        // Initially add multiple products to the cart
        const addRandomProducts = faker.helpers.arrayElements(PRODUCTS, { min: 4, max: 6 });

        for (const item of addRandomProducts) {
            console.log(`Adding product: ${item.name} to cart`);
            await product.addToCart(item.id);
        }
        
        await product.viewCart();
        await expect(cart.header).toContainText('Your Cart');

        // Verify all added products are visible in the cart
        for (const item of addRandomProducts) {
            const cartItemName = cart.cartItemNames.filter({ hasText: item.name });
            await expect(cartItemName).toBeVisible();
        }

        // Verify cart badge count matches the number of added products
        await expect(product.cartBadge).toHaveText(addRandomProducts.length.toString());

        // Remove some products from the cart
        const removeRandomProducts = faker.helpers.arrayElements(addRandomProducts, { min: 2, max: 3 });

        for (const item of removeRandomProducts) {
            console.log(`Removing product: ${item.name} from cart`);
            await cart.removeFromCart(item.id);
        }

        // Verify all removed products are not visible in the cart
        for (const item of removeRandomProducts) {
            const cartItemName = cart.cartItemNames.filter({ hasText: item.name });
            await expect(cartItemName).not.toBeVisible();
        }

        // Verify cart badge count matches the number of added products minus the number of removed products
        const expectedCount = addRandomProducts.length - removeRandomProducts.length;
        await expect(product.cartBadge).toHaveText(expectedCount.toString());
    });

    test('TC-007: Cart Persistence After Navigation', async ({ page }) => {
        const item = faker.helpers.arrayElement(PRODUCTS);
        const cartItemName = cart.cartItemNames.filter({ hasText: item.name });

        console.log(`Adding product: ${item.name} to cart`);
        await product.addToCart(item.id);
        await expect(product.cartBadge).toHaveText('1');

        await product.viewCart();
        await expect(cart.header).toContainText('Your Cart');

        await expect(cartItemName).toBeVisible();

        // Reload the page
        await page.reload({ waitUntil: 'networkidle' });

        await expect(product.cartBadge).toHaveText('1');
        await expect(cartItemName).toBeVisible();
    });

    test('TC-009: Proceed to Checkout - Verify Navigation to Checkout Page', async ({ page }) => {
        const item = faker.helpers.arrayElement(PRODUCTS);
        console.log(`Adding product: ${item.name} to cart`);
        await product.addToCart(item.id);

        await product.viewCart();
        await expect(cart.header).toContainText('Your Cart');
        await cart.checkout();

        await expect(page).toHaveURL(/.*checkout-step-one\.html/);
        await expect(checkout.header).toContainText('Checkout: Your Information');
    });

});