import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import ComboBox from '@/src/components/ComboBox/ComboBox';

describe('ComboBox', () => {
    it('renders without crashing', () => {
      const { container } = render(<ComboBox text={""} checkedOption={""} onOptionChange={() => {}} />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ComboBox text={""} checkedOption={""} onOptionChange={() => {}} />);
        expect(asFragment()).toMatchSnapshot();
      });
  });