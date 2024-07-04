import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import CheckableComboBox from '@/src/components/ComboBox/CheckableComboBox';
import { Label } from "@/src/model/Scheme";

describe('CheckableComboBox', () => {
    it('renders without crashing', () => {
      const { container } = render(<CheckableComboBox text={undefined} checkedLabels={[]} onChange={function (selectedOptions: Label[]): void {
          throw new Error("Function not implemented.");
      } }/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<CheckableComboBox text={undefined} checkedLabels={[]} onChange={function (selectedOptions: Label[]): void {
            throw new Error("Function not implemented.");
        } }/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });