import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import EditListModal from '@/src/components/Modal/EditModal/EditListModal';

describe('EditListModal', () => {
    it('renders without crashing', () => {
        const { container } = render(
        <EditListModal 
            onRenameAction={() => {}} 
            onDeleteAction={() => {}} 
            onInputChange={() => {}} 
            onClose={() => {}}      
            />);
        expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(
        <EditListModal 
            onRenameAction={() => {}} 
            onDeleteAction={() => {}} 
            onInputChange={() => {}} 
            onClose={() => {}}      
            />);
        expect(asFragment()).toMatchSnapshot();
      });
  });