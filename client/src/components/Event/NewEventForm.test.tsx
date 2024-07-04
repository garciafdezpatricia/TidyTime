import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import NewEventForm from '@/src/components/Event/NewEventForm';

describe('NewEventForm', () => {
    it('renders without crashing', () => {
    const { container } = render(
        <NewEventForm 
        titleRef={{current: null}} 
        infoRef={{current: null}} 
        fromDateRef={{current: null}} 
        toDateRef={{current: null}} 
        onColorChange={() => {}} 
        />
    );
    expect(container).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(
            <NewEventForm 
            titleRef={{current: null}} 
            infoRef={{current: null}} 
            fromDateRef={{current: null}} 
            toDateRef={{current: null}} 
            onColorChange={() => {}} 
            />
        );
        expect(asFragment()).toMatchSnapshot();
      });
  });