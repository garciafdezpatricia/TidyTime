import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import AbsoluteModal from '@/src/components/Modal/AbsoluteModal/AbsoluteModal';

describe('AbsoluteModal', () => {
    it('renders without crashing', () => {
      const { container } = render(<AbsoluteModal options={[]} onClick={function (arg?: any) {
          throw new Error("Function not implemented.");
      } } columnIndex={0} cardIndex={0} onClose={function (arg?: any) {
          throw new Error("Function not implemented.");
      } }/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<AbsoluteModal options={[]} onClick={function (arg?: any) {
            throw new Error("Function not implemented.");
        } } columnIndex={0} cardIndex={0} onClose={function (arg?: any) {
            throw new Error("Function not implemented.");
        } }/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });