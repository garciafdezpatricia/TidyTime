import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import SeeTaskModal from '@/src/components/Modal/EditModal/SeeTaskModal';

describe('SeeTaskModal', () => {
    it('renders without crashing', () => {
        const { container } = render(
        <SeeTaskModal onClose={function (arg?: any) {
                throw new Error("Function not implemented.");
            } }/>);
        expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(
        <SeeTaskModal onClose={function (arg?: any) {
                throw new Error("Function not implemented.");
            } }/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });