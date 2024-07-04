import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import ShareEventModal from '@/src/components/Modal/ShareModal/ShareEventModal';

describe('ShareEventModal', () => {
    it('renders without crashing', () => {
      const { container } = render(<ShareEventModal selectedIndex={0} />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ShareEventModal selectedIndex={0} />);
        expect(asFragment()).toMatchSnapshot();
      });
  });