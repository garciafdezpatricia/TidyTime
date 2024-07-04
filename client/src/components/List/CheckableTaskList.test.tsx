import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import CheckableTaskList from '@/src/components/List/CheckableTaskList';

describe('CheckableTaskList', () => {
    it('renders without crashing', () => {
      const { container } = render(<CheckableTaskList selectedTasks={[]} handleTaskCheck={() => {}}/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<CheckableTaskList selectedTasks={[]} handleTaskCheck={() => {}}/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });