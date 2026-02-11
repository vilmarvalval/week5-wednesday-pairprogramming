import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditJobPage from '../pages/EditJobPage';

const mockJob = {
  _id: '123',
  id: '123',
  title: 'Software Engineer',
  type: 'Full-Time',
  description: 'Develop amazing software',
  location: 'Helsinki',
  salary: 5000,
  company: {
    name: 'Tech Corp',
    contactEmail: 'hr@tech.com',
    contactPhone: '123-456-7890',
  },
};

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('EditJobPage - Iteration 6 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches job data and populates form fields', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Full-Time')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Develop amazing software')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tech Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('hr@tech.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Helsinki')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
  });

  it('sends PUT request to /api/jobs/:id when form is submitted', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockJob, title: 'Senior Developer' }),
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue('Software Engineer');
    await user.clear(titleInput);
    await user.type(titleInput, 'Senior Developer');

    await user.click(screen.getByRole('button', { name: /update job/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/jobs/123',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  it('sends updated job data with correct structure', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /update job/i }));

    await waitFor(() => {
      const putCall = global.fetch.mock.calls.find(call => call[1]?.method === 'PUT');
      expect(putCall).toBeDefined();
      const requestBody = JSON.parse(putCall[1].body);
      
      expect(requestBody.title).toBe('Software Engineer');
      expect(requestBody.type).toBe('Full-Time');
      expect(requestBody.description).toBe('Develop amazing software');
      expect(requestBody.location).toBe('Helsinki');
      expect(String(requestBody.salary)).toBe('5000'); // Can be number or string
      expect(requestBody.company).toBeDefined();
      expect(requestBody.company.name).toBe('Tech Corp');
      expect(requestBody.company.contactEmail).toBe('hr@tech.com');
      expect(requestBody.company.contactPhone).toBe('123-456-7890');
    });
  });

  it('navigates to job page after successful update', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /update job/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/jobs/123');
    });
  });

  it('navigates to job page when cancel button is clicked', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/jobs/123');
  });

  it('uses PUT method for the update request', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /update job/i }));

    await waitFor(() => {
      const putCalls = global.fetch.mock.calls.filter(call => call[1]?.method === 'PUT');
      expect(putCalls.length).toBe(1);
    });
  });

  it('handles update errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /update job/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalledWith('/jobs/123');
    });

    consoleErrorSpy.mockRestore();
  });

  it('includes Content-Type application/json header in PUT request', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/123']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /update job/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/jobs/123',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  it('updates the correct job based on URL parameter', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockJob, _id: '456', id: '456' }),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockJob, _id: '456', id: '456' }),
    });

    render(
      <MemoryRouter initialEntries={['/edit-job/456']}>
        <Routes>
          <Route path="/edit-job/:id" element={<EditJobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /update job/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs/456', expect.any(Object));
    });
  });
});
