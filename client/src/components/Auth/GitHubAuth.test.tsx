import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import GitHubAuthButton from '@/src/components/Auth/GitHubAuth';

describe('GitHubAuthButton', () => {
    it('renders without crashing', () => {
      const { container } = render(<GitHubAuthButton />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<GitHubAuthButton />);
        expect(asFragment()).toMatchSnapshot();
      });
  });