import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('JobPage - Iteration 4 Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches job from /api/jobs/:id endpoint on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs/123');
    });
  });

  it('displays loading state initially', () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders job details after successful fetch', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
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

    expect(screen.getByText(/Type:.*Full-Time/)).toBeInTheDocument();
    expect(screen.getByText(/Description:.*Develop amazing software/)).toBeInTheDocument();
    expect(screen.getByText(/Company:.*Tech Corp/)).toBeInTheDocument();
    expect(screen.getByText(/Contact Email:.*hr@tech.com/)).toBeInTheDocument();
    expect(screen.getByText(/Contact Phone:.*123-456-7890/)).toBeInTheDocument();
    expect(screen.getByText(/Location:.*Helsinki/)).toBeInTheDocument();
    expect(screen.getByText(/Salary:.*5000/)).toBeInTheDocument();
  });

  it('displays all job properties correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
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

    // Check all required fields are displayed
    expect(screen.getByText(/Tech Corp/)).toBeInTheDocument();
    expect(screen.getByText(/hr@tech.com/)).toBeInTheDocument();
    expect(screen.getByText(/123-456-7890/)).toBeInTheDocument();
    expect(screen.getByText(/Helsinki/)).toBeInTheDocument();
    expect(screen.getByText(/5000/)).toBeInTheDocument();
  });

  it('uses the correct job ID from URL params', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockJob, _id: '456', id: '456' }),
    });

    render(
      <MemoryRouter initialEntries={['/jobs/456']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs/456');
    });
  });

  it('handles fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(
      <MemoryRouter initialEntries={['/jobs/999']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles network errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter initialEntries={['/jobs/123']}>
        <Routes>
          <Route path="/jobs/:id" element={<JobPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('fetches job only once on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
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

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('displays Edit Job button with correct link', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
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

    const editButton = screen.getByText(/edit job/i);
    expect(editButton).toBeInTheDocument();
    expect(editButton.closest('a')).toHaveAttribute('href', '/edit-job/123');
  });

  it('displays Delete Job button', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
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

    expect(screen.getByRole('button', { name: /delete job/i })).toBeInTheDocument();
  });
});
