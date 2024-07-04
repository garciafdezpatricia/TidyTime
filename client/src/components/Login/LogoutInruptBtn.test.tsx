import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import LogoutInruptBtn from '@/src/components/Login/LogoutInruptBtn';

describe('LogoutInruptBtn', () => {
    it('renders without crashing', () => {
      const { container } = render(<LogoutInruptBtn/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<LogoutInruptBtn/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });