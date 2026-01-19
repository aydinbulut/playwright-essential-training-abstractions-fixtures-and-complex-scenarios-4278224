import { expect, request } from "@playwright/test";

// function to register a new user via API
export async function registerUser(email: string, password: string): Promise<Object> {
  const userData = {
    first_name: "Aydin",
    last_name: "Bulut",
    dob: "1992-01-01",
    phone: "0254654658",
    email: email,
    password: password,
    address: {
      street: "Danzigerkade 8",
      city: "Amsterdam",
      state: "Noord Holland",
      country: "NL",
      postal_code: "1013ap"
    }
  };

  const apiUrl = process.env.API_URL;
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(apiUrl + '/users/register', {
    data: userData
  });

  expect(response.status()).toBe(201);
  return userData;
}