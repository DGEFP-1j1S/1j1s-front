import React from "react";

interface BadgeProps {
	children: React.ReactNode
	className?: string
}

export function Badge({children, className, ...rest}: BadgeProps): React.ReactNode {
	return (
		<p className={`fr-badge ${className}`} {...rest}>{children}</p>
	);
}
