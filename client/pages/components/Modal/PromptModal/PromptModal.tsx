import { ReactNode } from "react";
import { Button } from "../../Button/Button";

export interface Props {
    onClose?: () => void;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    primaryActionText?: string;
    secondaryActionText?: string;
    title?: string;
    children?: ReactNode;
}

export default function PromptModal({
    onClose,
    onPrimaryAction,
    onSecondaryAction,
    primaryActionText,
    secondaryActionText,
    title,
    children} : Props) {

    return (
        <>
            <div className="backdrop"></div>
            <article className="prompt-modal">
                <h1>{title}</h1>
                {children}
                <div className="prompt-modal-button-section">
                    <Button
                        onClick={onSecondaryAction}
                        className="prompt-modal-secondary-btn"
                        >
                        {secondaryActionText}
                    </Button>
                    <Button
                        onClick={onPrimaryAction}
                    >
                        {primaryActionText}
                    </Button>
                </div>
            </article>
        </>
    )
}
