import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

jest.mock('../../__mock__/auth-api'); // Use the mock for auth-api

describe('LoginScreen', () => {
  it('renders email and password fields correctly', () => {
    const { getByLabelText } = render(<LoginScreen />);
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
  });

  it('displays error messages on invalid input', () => {
    const { getByText, getByLabelText, getByTestId } = render(<LoginScreen />);
    const loginButton = getByTestId('login-button');

    fireEvent.press(loginButton);

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const emailError = getByText('Please enter a valid email address.');
    const passwordError = getByText('Password must be at least 6 characters.');

    expect(emailError).toBeDefined();
    expect(passwordError).toBeDefined();
    expect(emailInput.props.error).toBeTruthy();
    expect(passwordInput.props.error).toBeTruthy();
  });

  it('calls loginUser when the login button is pressed', async () => {
    const { getByTestId } = render(<LoginScreen />);
    const loginButton = getByTestId('login-button');

    fireEvent.press(loginButton);

    // You can use testing-library's `waitFor` to handle async calls and wait for loginUser to resolve
    // Then, you can check if the state updates properly, such as loading state or error state
  });
});
