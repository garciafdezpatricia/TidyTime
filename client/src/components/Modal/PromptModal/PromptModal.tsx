import { ReactNode, useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

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

    const ref = useClickAway(() => {
        if (onSecondaryAction) {
            onSecondaryAction()
        }
    })

    const handleOnPrimaryAction = () => {
        if (onPrimaryAction) {
            onPrimaryAction();
        }
    }

    return (
        <>
            { backdrop && <div className="backdrop"></div>}
            { 
            // @ts-ignore
            <article ref={ref} className={variant ? variant : "prompt-modal"}>
                <p>{title}</p>
                {children}
                <div className="prompt-modal-button-section">
                    { onSecondaryAction && 
                        <button
                        onClick={onSecondaryAction}
                        className="prompt-modal-secondary-btn"
                        >
                        {secondaryActionText}
                        </button>
                    }
                    <button
                        data-testid='primary-button'
                        className="primary-button"
                        onClick={() => handleOnPrimaryAction()}
                    >
                        {primaryActionText}
                    </button>
                </div>
            </article>
            }
        </>
    )
}
