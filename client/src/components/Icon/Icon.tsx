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

