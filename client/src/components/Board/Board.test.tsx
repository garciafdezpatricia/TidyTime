import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Board from '@/src/components/Board/Board';

describe('Board', () => {
    it('renders without crashing', () => {
      const { container } = render(<Board handleCardClick={function (arg?: any) {
          throw new Error("Function not implemented.");
      } }/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Board handleCardClick={function (arg?: any) {
            throw new Error("Function not implemented.");
        } }/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });