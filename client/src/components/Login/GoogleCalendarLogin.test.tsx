import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import GoogleCalendarLogin from '@/src/components/Login/GoogleCalendarLogin';

describe('GoogleCalendarLogin', () => {
    it('renders without crashing', () => {
      const { container } = render(<GoogleCalendarLogin/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<GoogleCalendarLogin/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });