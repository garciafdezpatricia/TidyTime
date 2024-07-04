import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import CalendarMenu from '@/src/components/Menu/CalendarMenu';

describe('DonutChart', () => {
    it('renders without crashing', () => {
      const { container } = render(<CalendarMenu />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<CalendarMenu />);
        expect(asFragment()).toMatchSnapshot();
      });
  });