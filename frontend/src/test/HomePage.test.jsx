import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

// Mock the JobListing component to simplify testing
vi.mock('../components/JobListing', () => ({
  default: ({ id, title, company }) => (
    <div data-testid={`job-listing-${id}`}>
      <h2>{title}</h2>
      <p>{company.name}</p>
    </div>
  ),
}));

// Mock data for testing
const mockJobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    type: 'Full-time',
    description: 'We are looking for a Senior React Developer',
    company: {
      name: 'Tech Company A',
      contactEmail: 'contact@techA.com',
      contactPhone: '123-456-7890',
    },
    location: 'Helsinki',
    salary: 6000,
  },
  {
    id: '2',
    title: 'Junior Node.js Developer',
    type: 'Full-time',
    description: 'We are looking for a Junior Node.js Developer',
    company: {
      name: 'Tech Company B',
      contactEmail: 'contact@techB.com',
      contactPhone: '098-765-4321',
    },
    location: 'Espoo',
    salary: 4000,
  },
  {
    id: '3',
    title: 'Part-time UX Designer',
    type: 'Part-time',
    description: 'We are looking for a talented UX Designer',
    company: {
      name: 'Design Studio C',
      contactEmail: 'contact@designC.com',
      contactPhone: '555-123-4567',
    },
    location: 'Vantaa',
    salary: 2500,
  },
];

describe('HomePage - Iteration 2: Fetch Jobs from Backend', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test 1: Display "No jobs found" message when component mounts with empty state
   */
  it('should display "No jobs found" message initially', () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const noJobsMessage = screen.getByText('No jobs found');
    expect(noJobsMessage).toBeInTheDocument();
  });

  /**
   * Test 2: Fetch jobs from the API on component mount
   */
  it('should fetch jobs from /api/jobs endpoint on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs');
    });
  });

  /**
   * Test 3: Render all jobs from the API response
   */
  it('should render all jobs returned from the API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for all job listings to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('job-listing-1')).toBeInTheDocument();
      expect(screen.getByTestId('job-listing-2')).toBeInTheDocument();
      expect(screen.getByTestId('job-listing-3')).toBeInTheDocument();
    });

    // Verify job details are displayed
    expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
    expect(screen.getByText('Junior Node.js Developer')).toBeInTheDocument();
    expect(screen.getByText('Part-time UX Designer')).toBeInTheDocument();

    // Verify company names are displayed
    expect(screen.getByText('Tech Company A')).toBeInTheDocument();
    expect(screen.getByText('Tech Company B')).toBeInTheDocument();
    expect(screen.getByText('Design Studio C')).toBeInTheDocument();
  });

  /**
   * Test 4: Render the correct number of job listings
   */
  it('should render exactly the number of jobs from the API response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const jobListings = screen.getAllByTestId(/^job-listing-/);
      expect(jobListings).toHaveLength(3);
    });
  });

  /**
   * Test 5: Hide "No jobs found" message when jobs are loaded
   */
  it('should hide "No jobs found" message when jobs are fetched', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    const { rerender } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Initially "No jobs found" should be visible
    expect(screen.getByText('No jobs found')).toBeInTheDocument();

    // After jobs are fetched, it should not be visible
    await waitFor(() => {
      expect(screen.queryByText('No jobs found')).not.toBeInTheDocument();
    });
  });

  /**
   * Test 6: Handle API fetch errors gracefully
   */
  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Should still display "No jobs found" if fetch fails
    await waitFor(() => {
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  /**
   * Test 7: Handle API response with non-200 status code
   */
  it('should handle non-200 API responses', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Should display "No jobs found" if API returns error
    await waitFor(() => {
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
    });
  });

  /**
   * Test 8: Fetch is called only once on component mount
   */
  it('should call fetch only once on component mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Test 9: Jobs are passed correct props to JobListing component
   */
  it('should pass job data as props to JobListing components', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockJobs[0]],
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const jobListing = screen.getByTestId('job-listing-1');
      expect(jobListing).toBeInTheDocument();
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
      expect(screen.getByText('Tech Company A')).toBeInTheDocument();
    });
  });

  /**
   * Test 10: Empty array response displays "No jobs found"
   */
  it('should display "No jobs found" when API returns empty array', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
    });
  });

  /**
   * Test 11: Jobs list is correctly ordered as returned from API
   */
  it('should maintain the order of jobs as returned from the API', async () => {
    const twoJobs = [mockJobs[0], mockJobs[1]];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => twoJobs,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const jobListings = screen.getAllByTestId(/^job-listing-/);
      expect(jobListings[0]).toHaveAttribute('data-testid', 'job-listing-1');
      expect(jobListings[1]).toHaveAttribute('data-testid', 'job-listing-2');
    });
  });

  /**
   * Test 12: Component renders without crashing
   */
  it('should render without crashing', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
