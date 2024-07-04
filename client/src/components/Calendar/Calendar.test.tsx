import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Calendar from '@/src/components/Calendar/Calendar';

describe('Calendar', () => {
    it('renders without crashing', () => {
      const { container } = render(<Calendar/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Calendar/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });