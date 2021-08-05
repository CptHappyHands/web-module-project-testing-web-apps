import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.queryByText("Contact Form");
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/contact form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, "Bob");
  const error = await screen.getByTestId("error");
  expect(error).toHaveTextContent(
    "Error: firstName must have at least 5 characters"
  );
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, "");
  const error = await screen.queryAllByTestId("error");
  expect(error[0]).toHaveTextContent(
    "Error: firstName must have at least 5 characters"
  );

  const lastNameInput = screen.getByLabelText(/last name/i);
  userEvent.type(lastNameInput, "");
  expect(error[1]).toHaveTextContent("Error: lastName is a required field");

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, "");
  expect(error[2]).toHaveTextContent(
    "Error: email must be a valid email address"
  );
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, "Andrew");

  const lastNameInput = screen.getByLabelText(/last name/i);
  userEvent.type(lastNameInput, "Cummings");

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, "");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const error = screen.getByTestId("error");
  expect(error).toHaveTextContent("Error: email must be a valid email address");
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, "Andrew");

  const lastNameInput = screen.getByLabelText(/last name/i);
  userEvent.type(lastNameInput, "Cummings");

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, "HelloWorld");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const error = screen.getByTestId("error");
  expect(error).toHaveTextContent("Error: email must be a valid email address");
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, "Andrew");

  const lastNameInput = screen.getByLabelText(/last name/i);
  userEvent.type(lastNameInput, "");

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, "andrew.amalee@gmail.com");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const error = screen.getByTestId("error");
  expect(error).toHaveTextContent("Error: lastName is a required field");
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, "Andrew");

  const lastNameInput = screen.getByLabelText(/last name/i);
  userEvent.type(lastNameInput, "Cummings");

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, "andrew.amalee@gmail.com");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const firstNameDisplay = screen.getByTestId("firstnameDisplay");
  const lastNameDisplay = screen.getByTestId("lastnameDisplay");
  const emailDisplay = screen.getByTestId("emailDisplay");
  const messageDisplay = await screen.queryByTestId("messageDisplay");
  expect(firstNameDisplay).toHaveTextContent("Andrew");
  expect(lastNameDisplay).toHaveTextContent("Cummings");
  expect(emailDisplay).toHaveTextContent("andrew.amalee@gmail.com");
  expect(messageDisplay).not.toBeInTheDocument();
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText(/first name/i);
  userEvent.type(firstNameInput, "Andrew");

  const lastNameInput = screen.getByLabelText(/last name/i);
  userEvent.type(lastNameInput, "Cummings");

  const emailInput = screen.getByLabelText(/email/i);
  userEvent.type(emailInput, "andrew.amalee@gmail.com");

  const messageInput = screen.getByLabelText(/message/i);
  userEvent.type(messageInput, "Hello World");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const firstNameDisplay = screen.getByTestId("firstnameDisplay");
  const lastNameDisplay = screen.getByTestId("lastnameDisplay");
  const emailDisplay = screen.getByTestId("emailDisplay");
  const messageDisplay = screen.getByTestId("messageDisplay");
  expect(firstNameDisplay).toHaveTextContent("Andrew");
  expect(lastNameDisplay).toHaveTextContent("Cummings");
  expect(emailDisplay).toHaveTextContent("andrew.amalee@gmail.com");
  expect(messageDisplay).toHaveTextContent("Hello World");
});
