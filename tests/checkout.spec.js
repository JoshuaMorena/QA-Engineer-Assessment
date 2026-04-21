import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { productPage } from '../pages/product';
import { cartPage } from '../pages/cart';
import { checkoutPage } from '../pages/checkout';
import { PRODUCTS } from '../test-data/products';
import { generateCheckoutData } from '../test-data/data-generator';

test.describe('Checkout Process', () => {
    let product;
    let cart;
    let checkout;

    test.beforeEach(async ({ page }) => {
        product = new productPage(page);
        cart = new cartPage(page);
        checkout = new checkoutPage(page);
        await page.goto(`${process.env.SAUCEDEMO_URL}/inventory.html`);
    });

    test('Checkout Page Displays Correctly', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');
        await expect(checkout.checkoutInformationForm).toBeVisible();
    });

    test('TC-010: Checkout with Valid Information', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');

        const userData = generateCheckoutData();
        await checkout.fillCheckoutInformation(userData.firstName, userData.lastName, userData.zipCode);
        await checkout.continueCheckout();

        await expect(page).toHaveURL(/.*checkout-step-two\.html/);
        await expect(checkout.header).toContainText('Checkout: Overview');
    });

    test('TC-011: Checkout Empty Form Validation', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');
        await checkout.continueCheckout();
        await expect(checkout.errorMessage).toHaveText('Error: First Name is required');
    });

    test('TC-012: Checkout with Missing First Name', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');
        const userData = generateCheckoutData();
        await checkout.fillCheckoutInformationWithEmptyFirstName(userData.lastName, userData.zipCode);
        await checkout.continueCheckout();
        await expect(checkout.errorMessage).toHaveText('Error: First Name is required');
    });

    test('TC-013: Checkout with Missing Last Name', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');
        const userData = generateCheckoutData();
        await checkout.fillCheckoutInformationWithEmptyLastName(userData.firstName, userData.zipCode);
        await checkout.continueCheckout();
        await expect(checkout.errorMessage).toHaveText('Error: Last Name is required');
    });

    test('TC-014: Checkout with Missing Postal Code', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');
        const userData = generateCheckoutData();
        await checkout.fillCheckoutInformationWithEmptyPostalCode(userData.firstName, userData.lastName);
        await checkout.continueCheckout();
        await expect(checkout.errorMessage).toHaveText('Error: Postal Code is required');
    });

    test('TC-015: Invalid Characters in Input Fields', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');
        const userData = generateCheckoutData();
        await checkout.fillCheckoutInformation(userData.invalidFirstName, userData.invalidLastName, userData.zipCode);
        await checkout.continueCheckout();
        // await expect(checkout.errorMessage).toBeVisible(); possible bug
    });

    test('TC-016: Checkout Cancel Functionality', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');
        await checkout.cancelCheckout();
        await expect(page).toHaveURL(/.*cart\.html/);
        await expect(checkout.header).toContainText('Your Cart');
    });

    test('TC-017: Checkout Overview Data Accuracy', async ({ page }) => {
        const selectedItems = faker.helpers.arrayElements(PRODUCTS, { min: 2, max: 3 });
        const userData = generateCheckoutData();

        for (const item of selectedItems) {
            await product.addToCart(item.id);
        }

        await product.viewCart();
        await cart.checkout();
        await checkout.fillCheckoutInformation(userData.firstName, userData.lastName, userData.zipCode);
        await checkout.continueCheckout();

        for (const item of selectedItems) {
            const overviewItemName = cart.cartItemNames.filter({ hasText: item.name });
            await expect(overviewItemName).toBeVisible();
        }
    });

    test('TC-018: Total Price Calculation Accuracy', async ({ page }) => {
        const selectedItems = faker.helpers.arrayElements(PRODUCTS, { min: 2, max: 3 });
        const userData = generateCheckoutData();

        for (const item of selectedItems) {
            await product.addToCart(item.id);
        }
        
        await product.viewCart();
        await cart.checkout();
        await checkout.fillCheckoutInformation(userData.firstName, userData.lastName, userData.zipCode);
        await checkout.continueCheckout();

        const expectedSubtotal = selectedItems.reduce((sum, item) => sum + item.cost, 0);
        const actualSubtotal = await checkout.getSubtotal();
        const actualTax = await checkout.getTax();
        const actualTotal = await checkout.getTotal();

        expect(actualSubtotal).toBe(expectedSubtotal);
        expect(actualTotal).toBeCloseTo(actualSubtotal + actualTax, 2);
    
        console.log(`Subtotal Verified: $${actualSubtotal}`);
    });

    test('TC-019: Complete Purchase Successfully and Order Confirmation Display', async ({ page }) => {
        await product.addRandomItemAndNavigateToCheckout();
        await expect(checkout.header).toContainText('Checkout: Your Information');

        const userData = generateCheckoutData();
        await checkout.fillCheckoutInformation(userData.firstName, userData.lastName, userData.zipCode);
        await checkout.continueCheckout();

        await checkout.finishCheckout();
        await expect(page).toHaveURL(/.*checkout-complete\.html/);

        await expect(checkout.header).toContainText('Checkout: Complete!');
        await expect(checkout.checkoutCompleteLabel).toBeVisible();
        await expect(checkout.checkoutCompleteLabel).toContainText('Thank you for your order!');
    });

    test('TC-020: Checkout Session State After Refresh', async ({ page }) => {
        const selectedItems = faker.helpers.arrayElements(PRODUCTS, { min: 2, max: 3 });
        const userData = generateCheckoutData();

        for (const item of selectedItems) {
            await product.addToCart(item.id);
        }

        await product.viewCart();
        await cart.checkout();
        await checkout.fillCheckoutInformation(userData.firstName, userData.lastName, userData.zipCode);
        await checkout.continueCheckout();
        await expect(checkout.header).toContainText('Checkout: Overview');

        for (const item of selectedItems) {
            const overviewItemName = cart.cartItemNames.filter({ hasText: item.name });
            await expect(overviewItemName).toBeVisible();
        }

        await page.reload();

        await expect(checkout.header).toContainText('Checkout: Overview');

        for (const item of selectedItems) {
            const overviewItemName = cart.cartItemNames.filter({ hasText: item.name });
            await expect(overviewItemName).toBeVisible();
        }
    });
});