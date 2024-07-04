import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import {Icon} from '@/src/components/Icon/Icon';

describe('Icon', () => {
    it('renders without crashing', () => {
      const { container } = render(<Icon src={""} alt={""}/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Icon src={""} alt={""}/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });