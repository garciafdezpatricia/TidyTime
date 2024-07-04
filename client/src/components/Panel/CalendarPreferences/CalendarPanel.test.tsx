import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import CalendarPanel from '@/src/components/Panel/CalendarPreferences/CalendarPanel';

describe('CalendarPanel', () => {
    it('renders without crashing', () => {
      const { container } = render(<CalendarPanel />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<CalendarPanel />);
        expect(asFragment()).toMatchSnapshot();
      });
  });