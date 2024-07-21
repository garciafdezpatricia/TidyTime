// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
