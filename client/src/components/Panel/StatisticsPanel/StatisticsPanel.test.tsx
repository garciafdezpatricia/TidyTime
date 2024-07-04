import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import StatisticsPanel from '@/src/components/Panel/StatisticsPanel/StatisticsPanel';

describe('StatisticsPanel', () => {
    it('renders without crashing', () => {
      const { container } = render(<StatisticsPanel />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<StatisticsPanel />);
        expect(asFragment()).toMatchSnapshot();
      });
  });