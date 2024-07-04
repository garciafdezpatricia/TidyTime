import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import SearchBar from '@/src/components/SearchBar/SearchBar';

describe('SearchBar', () => {
    it('renders without crashing', () => {
      const { container } = render(<SearchBar />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<SearchBar />);
        expect(asFragment()).toMatchSnapshot();
      });
  });