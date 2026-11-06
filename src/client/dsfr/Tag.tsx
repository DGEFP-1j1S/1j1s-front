import classNames from "classnames";
import React from "react";

interface TagProps {
	children: React.ReactNode
	className?: string
}

export function Tag({children, className, ...rest}: TagProps): React.ReactNode {
	return (
		<p className={classNames("fr-tag", className)} {...rest}>{children}</p>
	);
}
