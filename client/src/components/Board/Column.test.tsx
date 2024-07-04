import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Column from '@/src/components/Board/Column';

describe('Column', () => {
    it('renders without crashing', () => {
      const { container } = render(<Column sectionWidth={0} content={[]} index={0} name={""} handleMoveTask={function (arg?: any, arg2?: any) {
          throw new Error("Function not implemented.");
      } } handleCardClick={function (arg?: any) {
          throw new Error("Function not implemented.");
      } }/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Column sectionWidth={0} content={[]} index={0} name={""} handleMoveTask={function (arg?: any, arg2?: any) {
            throw new Error("Function not implemented.");
        } } handleCardClick={function (arg?: any) {
            throw new Error("Function not implemented.");
        } }/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });