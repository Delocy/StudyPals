import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalendarScreen from './CalendarScreen';

// Mock dependencies (if needed)
jest.mock('../../../firebase.js', () => ({
  firestore: {},
  auth: { currentUser: { uid: 'user-id' } },
}));

// Sample mocked tasks data for testing
const mockedTasks = [
  {
    id: 'task-id-1',
    name: 'Task 1',
    description: 'Description for Task 1',
    startTime: { seconds: 1662305020 },
    endTime: { seconds: 1662308600 },
    time: 1662305020,
    tags: ['tag1', 'tag2'],
    completed: false,
  },
  // Add more tasks as needed...
];

// Mock the loadTasks function for the useEffect hook in CalendarScreen
jest.mock('./CalendarScreen', () => ({
  __esModule: true,
  default: jest.fn(() => <></>),
  loadTasks: jest.fn(() => {
    return new Promise((resolve) => {
      // Simulate a delay of 500ms before resolving the promise
      setTimeout(() => resolve(mockedTasks), 500);
    });
  }),
}));

describe('CalendarScreen', () => {
  it('renders calendar screen correctly', async () => {
    // Render the CalendarScreen
    const { getByText } = render(<CalendarScreen />);

    // Wait for tasks to load
    await new Promise((r) => setTimeout(r, 600));

    // Check if the rendered tasks are displayed correctly
    mockedTasks.forEach((task) => {
      const taskName = getByText(task.name);
      const taskDescription = getByText(task.description);
      expect(taskName).toBeDefined();
      expect(taskDescription).toBeDefined();
    });
  });

  it('displays no tasks for an empty date', async () => {
    // Render the CalendarScreen
    const { getByText } = render(<CalendarScreen />);

    // Wait for tasks to load
    await new Promise((r) => setTimeout(r, 600));

    // Check if "No tasks for this date" is displayed for a date without tasks
    const noTasksText = getByText('No tasks for this date');
    expect(noTasksText).toBeDefined();
  });

  it('opens the task modal on item press', async () => {
    // Render the CalendarScreen
    const { getByText, getByTestId } = render(<CalendarScreen />);

    // Wait for tasks to load
    await new Promise((r) => setTimeout(r, 600));

    // Click on a task to open the modal
    const taskToClick = mockedTasks[0];
    const taskName = getByText(taskToClick.name);
    fireEvent.press(taskName);

    // Check if the modal is visible
    const modal = getByTestId('modal-container');
    expect(modal).toBeDefined();
  });

  // Add more tests for other functionalities as needed...

});
