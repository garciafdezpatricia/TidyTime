import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import ListPanel from '@/src/components/Panel/ListPreferences/ListPanel';

describe('ListPanel', () => {
    it('renders without crashing', () => {
      const { container } = render(<ListPanel />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ListPanel />);
        expect(asFragment()).toMatchSnapshot();
      });
  });