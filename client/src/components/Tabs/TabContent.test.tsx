import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import FilterSection from '@/src/components/Tabs/TabContent';
import TabContent from '@/src/components/Tabs/TabContent';

describe('FilterSection', () => {
    it('renders without crashing', () => {
      const { container } = render(<FilterSection handleCheck={() => {}} handleEditModal={() => {}} seeDone={false} />);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<FilterSection handleCheck={() => {}} handleEditModal={() => {}} seeDone={false} />);
        expect(asFragment()).toMatchSnapshot();
      });
});

describe('TabContent', () => {
    it('renders without crashing', () => {
      const { container } = render(<TabContent handleCheck={() => {}} handleEditModal={() => {}} seeDone={false}/>);
      expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<TabContent handleCheck={() => {}} handleEditModal={() => {}} seeDone={false}/>);
        expect(asFragment()).toMatchSnapshot();
      });
});