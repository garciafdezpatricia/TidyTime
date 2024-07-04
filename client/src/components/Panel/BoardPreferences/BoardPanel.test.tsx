import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import BoardPanel from '@/src/components/Panel/BoardPreferences/BoardPanel';

describe('BoardPanel', () => {
    it('renders without crashing', () => {
      const { container } = render(<BoardPanel />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<BoardPanel />);
        expect(asFragment()).toMatchSnapshot();
      });
  });