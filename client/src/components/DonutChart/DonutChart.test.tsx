import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import DonutChart from '@/src/components/DonutChart/DonutChart';

describe('DonutChart', () => {
    it('renders without crashing', () => {
      const { container } = render(<DonutChart total={2} value={0} />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<DonutChart total={2} value={0} />);
        expect(asFragment()).toMatchSnapshot();
      });
  });