# QA Engineer Assessment - SauceDemo Test Suite

This project is a comprehensive test automation suite for the SauceDemo e-commerce website using Playwright. It implements Page Object Model (POM) design pattern and includes tests for cart functionality, checkout process, and user authentication.

## Features

- **Authentication Setup**: Automated login and session management
- **Cart Management**: Tests for adding/removing products from cart
- **Checkout Process**: Complete checkout flow validation including form validation
- **Data-Driven Testing**: Uses Faker.js for generating test data
- **Page Object Model**: Maintainable and reusable page objects
- **Cross-Browser Testing**: Configured for Chromium with screenshot capture on failures

## Technologies Used

- **Playwright**: End-to-end testing framework
- **Node.js**: Runtime environment
- **@faker-js/faker**: Test data generation
- **dotenv**: Environment variable management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd QA-Engineer-Assessment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
SAUCEDEMO_URL=https://www.saucedemo.com
SAUCEDEMO_USERNAME=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
```

## Project Structure

```
├── pages/                    # Page Object Model classes
│   ├── cart.js              # Cart page interactions
│   ├── checkout.js          # Checkout page interactions
│   ├── login.js             # Login page interactions
│   └── product.js           # Product listing page interactions
├── test-data/               # Test data and generators
│   ├── auth.json            # Authentication state storage
│   ├── data-generator.js    # Faker-based data generation
│   └── products.js          # Product catalog data
├── tests/                   # Test specifications
│   ├── addToCart.spec.js    # Cart functionality tests
│   ├── auth.setup.js        # Authentication setup
│   └── checkout.spec.js     # Checkout process tests
├── playwright-report/       # Test execution reports
├── test-results/            # Test artifacts and screenshots
├── package.json             # Project dependencies
├── playwright.config.js     # Playwright configuration
└── README.md               # This file
```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test addToCart.spec.js
```

### Run Tests with UI Mode
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (visible browser)
```bash
npx playwright test --headed
```

### Generate and View HTML Report
```bash
npx playwright show-report
```

## Test Cases Covered

### Cart Functionality (addToCart.spec.js)
- **TC-002**: Add single product to cart - verify badge count
- **TC-003**: Add multiple products to cart - verify badge count
- **TC-004**: Verify cart item display
- **TC-005**: View empty cart
- **TC-006**: Remove products from cart - verify badge count
- **TC-007**: Cart Persistence After Navigation
- **TC-009**: Proceed to Checkout

### Checkout Process (checkout.spec.js)
- **TC-010**: Checkout with valid information
- **TC-011**: Empty form validation
- **TC-012**: Missing first name validation
- **TC-013**: Missing last name validation
- **TC-014**: Missing postal code validation
- **TC-015**: Invalid character validation
- **TC-016**: Checkout Cancel Functionality
- **TC-017**: Checkout Overview Data Accuracy
- **TC-018**: Total Price Calculation Accuracy
- **TC-019**: Complete Purchase Successfully and Order Confirmation Display
- **TC-020**: Checkout Session State After Refresh

## Configuration

The `playwright.config.js` file includes:
- Screenshot capture on test failures
- Authentication setup project
- Chromium browser configuration
- Storage state management for authenticated sessions

## Page Objects

The project uses Page Object Model for better maintainability:

- **loginPage**: Handles user authentication
- **productPage**: Manages product listing and cart operations
- **cartPage**: Handles cart item management
- **checkoutPage**: Manages checkout form and process

## Test Data

- **Products**: Static product catalog from SauceDemo
- **User Data**: Dynamically generated using Faker.js for checkout forms
- **Authentication**: Environment-based credentials

## License

This project is for educational purposes as part of a QA Engineer assessment.