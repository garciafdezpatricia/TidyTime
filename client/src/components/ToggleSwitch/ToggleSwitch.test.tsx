import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Toggle from '@/src/components/ToggleSwitch/ToggleSwitch';

describe('Toggle', () => {
    it('renders without crashing', () => {
      const { container } = render(<Toggle isChecked={false} onChange={() => {}}/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Toggle isChecked={false} onChange={() => {}}/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });