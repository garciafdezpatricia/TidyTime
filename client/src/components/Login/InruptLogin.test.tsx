import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import InruptLogin from '@/src/components/Login/InruptLogin';

describe('InruptLogin', () => {
    it('renders without crashing', () => {
      const { container } = render(<InruptLogin/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<InruptLogin/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });