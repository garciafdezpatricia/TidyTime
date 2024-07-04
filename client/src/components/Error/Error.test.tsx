import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import ErrorPage from '@/src/components/Error/Error';

describe('Error', () => {
    it('renders without crashing', () => {
      const { container } = render(<ErrorPage error={new Error()} resetErrorBoundary={undefined}/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ErrorPage error={new Error()} resetErrorBoundary={undefined}/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });