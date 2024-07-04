import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import PromptModal from '@/src/components/Modal/PromptModal/PromptModal';

describe('PromptModal without backdrop', () => {
    it('renders without crashing', () => {
      const { container } = render(<PromptModal backdrop={false}/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<PromptModal backdrop={false}/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });

  describe('PromptModal with backdrop', () => {
    it('renders without crashing', () => {
      const { container } = render(<PromptModal backdrop={true}/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<PromptModal backdrop={true}/>);
        expect(asFragment()).toMatchSnapshot();
      });
  });