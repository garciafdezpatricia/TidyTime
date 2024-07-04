import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import EditEventModal from '@/src/components/Modal/EditModal/EditEventModal';

describe('EditEventModal', () => {
    it('renders without crashing', () => {
        const { container } = render(
        <EditEventModal onClose={function (arg?: any) {
                throw new Error("Function not implemented.");
            } }   />);
        expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(
        <EditEventModal onClose={function (arg?: any) {
                throw new Error("Function not implemented.");
            } }   />);
        expect(asFragment()).toMatchSnapshot();
      });
  });