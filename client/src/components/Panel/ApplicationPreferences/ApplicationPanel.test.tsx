import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import {Application} from '@/src/components/Panel/ApplicationPreferences/ApplicationPanel';

describe('Application', () => {
    it('renders without crashing', () => {
      const { container } = render(<Application appImg={""} appAlt={""} appName={""} appDesc={""} onChange={function (arg?: any) {
        throw new Error("Function not implemented.");
      } } />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Application appImg={""} appAlt={""} appName={""} appDesc={""} onChange={function (arg?: any) {
          throw new Error("Function not implemented.");
        } } />);
        expect(asFragment()).toMatchSnapshot();
      });
  });