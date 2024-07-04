import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import Layout from '@/src/components/Layout/Layout';

describe('Layout', () => {
    it('renders without crashing', () => {
      const { container } = render(<Layout><></></Layout>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Layout><></></Layout>);
        expect(asFragment()).toMatchSnapshot();
      });
  });