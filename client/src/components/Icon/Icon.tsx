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

interface Props {
    src: string,
    alt: string,
    className? : string,
}

export function Icon ({src, className="btn-icon", alt } : Props) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
            className={className}
            src={src}
            alt={alt}>
        </img>
    )
}

