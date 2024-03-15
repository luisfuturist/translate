import { ComponentProps } from "react";


interface Props extends ComponentProps<"a"> {
    name?: string;
}

export default function Icon({ className, children, ...props }: Props) {
    return (
        <span className={`material-symbols-outlined ${className}`} {...props}>
            {props.name || children}
        </span>
    )
}
