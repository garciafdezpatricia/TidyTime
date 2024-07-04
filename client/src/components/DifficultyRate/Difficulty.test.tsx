import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Difficulty from '@/src/components/DifficultyRate/Difficulty';

describe('GitHubAuthButton', () => {
    it('renders without crashing', () => {
      const { container } = render(<Difficulty difficulty={4} />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Difficulty difficulty={4} />);
        expect(asFragment()).toMatchSnapshot();
      });
  });