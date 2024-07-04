import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import NewTaskForm from '@/src/components/Form/NewTaskForm/NewTaskForm';

describe('NewTaskForm', () => {
    it('renders without crashing', () => {
      const { container } = render(<NewTaskForm/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<NewTaskForm/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });