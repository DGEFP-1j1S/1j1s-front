import React, { useId } from 'react';

import { Label } from "~/client/components/ui/Form/Label";

type CheckboxProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{ id: idProps, label, ...rest  }
	, ref,
) {
	const idState = useId();
	const id = idProps ?? idState;

	return (
		<div className="fr-checkbox-group">
			<input
				type="checkbox"
				id={id}
				ref={ref}
				{...rest} />
			<Label htmlFor={id}>{label}</Label>
		</div>
	);
});
