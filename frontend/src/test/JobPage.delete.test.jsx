import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import JobPage from '../pages/JobPage';

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
  postedDate: '2025-11-01T00:00:00.000Z',
};

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('JobPage - Iteration 5 Tests (Delete Functionality)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('sends DELETE request to /api/jobs/:id when delete button is clicked', async () => {
    const user = userEvent.setup();

    // Mock fetch for initial job load
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    // Mock fetch for delete request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete job/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs/123', {
        method: 'DELETE',
      });
    });
  });

  it('navigates to home page after successful deletion', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete job/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('uses DELETE method for the request', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete job/i }));

    await waitFor(() => {
      const deleteCalls = global.fetch.mock.calls.filter(
        call => call[1]?.method === 'DELETE'
      );
      expect(deleteCalls.length).toBe(1);
      expect(deleteCalls[0][0]).toBe('/api/jobs/123');
    });
  });

  it('handles delete errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete job/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles network errors during deletion', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete job/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('deletes the correct job based on URL parameter', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockJob, _id: '456', id: '456' }),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter initialEntries={['/jobs/456']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete job/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs/456', {
        method: 'DELETE',
      });
    });
  });

  it('only calls delete API once per button click', async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete job/i }));

    await waitFor(() => {
      const deleteCalls = global.fetch.mock.calls.filter(
        call => call[1]?.method === 'DELETE'
      );
      expect(deleteCalls.length).toBe(1);
    });
  });
});
