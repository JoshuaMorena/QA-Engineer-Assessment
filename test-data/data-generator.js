import { faker } from '@faker-js/faker';

export const generateCheckoutData = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    zipCode: faker.location.zipCode(),
    invalidFirstName: "J@hn",
    invalidLastName: "D0%",
});
