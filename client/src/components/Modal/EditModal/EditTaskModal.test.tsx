import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import EditTaskModal from '@/src/components/Modal/EditModal/EditTaskModal';

describe('EditTaskModal', () => {
    it('renders without crashing', () => {
        const { container } = render(
        <EditTaskModal onClose={function (arg?: any) {
                throw new Error("Function not implemented.");
            } } isOpen={false}/>);
        expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(
        <EditTaskModal onClose={function (arg?: any) {
                throw new Error("Function not implemented.");
            } } isOpen={false}/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });