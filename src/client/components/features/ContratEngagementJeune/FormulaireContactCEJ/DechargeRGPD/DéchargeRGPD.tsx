import React from 'react';

import { Link } from '../../../../ui/Link/Link';
import styles from './DéchargeRGPD.module.scss';

export function DéchargeRGPD() {
	return (
		<p className={styles.décharge}>
      Vous êtes informé que vos données à caractère personnel sont collectées et traitées par la DGEFP afin de les
      transférer à France Travail. Pour en savoir plus vous pouvez consulter la <Link href="/confidentialite">politique de
      confidentialité</Link> et les <Link href="/cgu">CGU</Link> de la DGEFP.
		</p>
	);
}
