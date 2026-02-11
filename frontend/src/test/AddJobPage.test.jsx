import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddJobPage from '../pages/AddJobPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddJobPage - Iteration 3 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const renderAddJobPage = () => {
    return render(
      <BrowserRouter>
        <AddJobPage />
      </BrowserRouter>
    );
  };

  it('renders the add job form with all fields', () => {
    renderAddJobPage();
    
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add job/i })).toBeInTheDocument();
  });

  it('submits form data to POST /api/jobs endpoint', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        _id: '123',
        title: 'Software Engineer',
        type: 'Full-Time',
        description: 'Great job',
        location: 'Helsinki',
        salary: 5000,
        company: {
          name: 'Tech Corp',
          contactEmail: 'hr@tech.com',
          contactPhone: '123-456-7890'
        }
      }),
    });

    renderAddJobPage();

    await user.type(screen.getByLabelText(/job title/i), 'Software Engineer');
    await user.selectOptions(screen.getByLabelText(/job type/i), 'Full-Time');
    await user.type(screen.getByLabelText(/job description/i), 'Great job');
    await user.type(screen.getByLabelText(/company name/i), 'Tech Corp');
    await user.type(screen.getByLabelText(/contact email/i), 'hr@tech.com');
    await user.type(screen.getByLabelText(/contact phone/i), '123-456-7890');
    await user.type(screen.getByLabelText(/location/i), 'Helsinki');
    await user.clear(screen.getByLabelText(/salary/i));
    await user.type(screen.getByLabelText(/salary/i), '5000');

    await user.click(screen.getByRole('button', { name: /add job/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Software Engineer',
          type: 'Full-Time',
          description: 'Great job',
          location: 'Helsinki',
          salary: '5000',
          company: {
            name: 'Tech Corp',
            contactEmail: 'hr@tech.com',
            contactPhone: '123-456-7890',
          },
        }),
      });
    });
  });

  it('navigates to home page after successful submission', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: '123' }),
    });

    renderAddJobPage();

    await user.type(screen.getByLabelText(/job title/i), 'Test Job');
    await user.type(screen.getByLabelText(/company name/i), 'Test Company');
    await user.type(screen.getByLabelText(/contact email/i), 'test@test.com');
    await user.click(screen.getByRole('button', { name: /add job/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    renderAddJobPage();

    await user.type(screen.getByLabelText(/job title/i), 'Test Job');
    await user.type(screen.getByLabelText(/company name/i), 'Test Company');
    await user.type(screen.getByLabelText(/contact email/i), 'test@test.com');
    await user.click(screen.getByRole('button', { name: /add job/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('sends correct data structure with nested company object', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: '123' }),
    });

    renderAddJobPage();

    await user.type(screen.getByLabelText(/job title/i), 'Developer');
    await user.type(screen.getByLabelText(/company name/i), 'DevCo');
    await user.type(screen.getByLabelText(/contact email/i), 'dev@co.com');
    await user.type(screen.getByLabelText(/contact phone/i), '555-1234');
    await user.click(screen.getByRole('button', { name: /add job/i }));

    await waitFor(() => {
      const fetchCall = global.fetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      
      expect(requestBody.company).toBeDefined();
      expect(requestBody.company.name).toBe('DevCo');
      expect(requestBody.company.contactEmail).toBe('dev@co.com');
      expect(requestBody.company.contactPhone).toBe('555-1234');
    });
  });

  it('uses POST method for the fetch request', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: '123' }),
    });

    renderAddJobPage();

    await user.type(screen.getByLabelText(/job title/i), 'Test');
    await user.type(screen.getByLabelText(/company name/i), 'Test');
    await user.type(screen.getByLabelText(/contact email/i), 'test@test.com');
    await user.click(screen.getByRole('button', { name: /add job/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/jobs',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('includes Content-Type application/json header', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: '123' }),
    });

    renderAddJobPage();

    await user.type(screen.getByLabelText(/job title/i), 'Test');
    await user.type(screen.getByLabelText(/company name/i), 'Test');
    await user.type(screen.getByLabelText(/contact email/i), 'test@test.com');
    await user.click(screen.getByRole('button', { name: /add job/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/jobs',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  it('handles network errors', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderAddJobPage();

    await user.type(screen.getByLabelText(/job title/i), 'Test');
    await user.type(screen.getByLabelText(/company name/i), 'Test');
    await user.type(screen.getByLabelText(/contact email/i), 'test@test.com');
    await user.click(screen.getByRole('button', { name: /add job/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
