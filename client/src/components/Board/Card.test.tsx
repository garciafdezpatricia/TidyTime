import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Card from '@/src/components/Board/Card';

describe('Card', () => {
    it('renders without crashing', () => {
      const { container } = render(<Card cardIndex={0} title={""} list={""} taskId={""} columnIndex={0} handleMoveTask={function (arg?: any, arg2?: any) {
          throw new Error("Function not implemented.");
      } } handleCardClick={function (arg?: any) {
          throw new Error("Function not implemented.");
      } }/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Card cardIndex={0} title={""} list={""} taskId={""} columnIndex={0} handleMoveTask={function (arg?: any, arg2?: any) {
            throw new Error("Function not implemented.");
        } } handleCardClick={function (arg?: any) {
            throw new Error("Function not implemented.");
        } }/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });