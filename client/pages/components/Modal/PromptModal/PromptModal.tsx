import { ReactNode } from "react";
import { Button } from "../../Button/Button";

export interface Props {
    onClose?: () => void;
    onPrimaryAction?: (arg?:any) => void | any;
    onSecondaryAction?: (arg?:any) => void | any;
    primaryActionText?: string;
    secondaryActionText?: string;
    title?: string;
    backdrop: boolean;
    children?: ReactNode;
    variant?: string;
}

export default function PromptModal({
    onClose,
    onPrimaryAction,
    onSecondaryAction,
    primaryActionText,
    secondaryActionText,
    title,
    backdrop,
    children, 
    variant} : Props) {

    return (
        <>
            { backdrop && <div className="backdrop"></div>}
            <article className={variant ? variant : "prompt-modal"}>
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
