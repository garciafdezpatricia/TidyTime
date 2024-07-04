import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Loading from '@/src/components/Loading/Loading';

describe('Loading', () => {
    it('renders without crashing', () => {
      const { container } = render(<Loading/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Loading/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });