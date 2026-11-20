import { act, renderHook } from '@testing-library/react';

import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';

describe('useReinitialisationFormulaire', () => {
	it('renvoie les valeurs reçues tant que le formulaire n‘est pas réinitialisé', () => {
		const { result } = renderHook(() => useReinitialisationFormulaire({ motCle: 'boulanger' }));

		expect(result.current.valeursInitiales).toEqual({ motCle: 'boulanger' });
		expect(result.current.estReinitialise).toBe(false);
	});

	it('renvoie des valeurs vides et change de clé une fois réinitialisé', () => {
		const { result } = renderHook(() => useReinitialisationFormulaire({ motCle: 'boulanger' }));
		const clePrecedente = result.current.cle;

		act(() => result.current.reinitialiser());

		expect(result.current.valeursInitiales).toEqual({});
		expect(result.current.estReinitialise).toBe(true);
		expect(result.current.cle).not.toBe(clePrecedente);
	});

	it('reprend les nouvelles valeurs quand elles changent après une réinitialisation', () => {
		const { result, rerender } = renderHook(
			({ valeurs }) => useReinitialisationFormulaire(valeurs),
			{ initialProps: { valeurs: { motCle: 'boulanger' } } },
		);
		act(() => result.current.reinitialiser());
		const cleApresReinitialisation = result.current.cle;

		rerender({ valeurs: { motCle: 'cuisinier' } });

		expect(result.current.valeursInitiales).toEqual({ motCle: 'cuisinier' });
		expect(result.current.estReinitialise).toBe(false);
		expect(result.current.cle).toBe(cleApresReinitialisation);
	});

	it('reste réinitialisé quand les valeurs sont recréées à l‘identique', () => {
		const { result, rerender } = renderHook(
			({ valeurs }) => useReinitialisationFormulaire(valeurs),
			{ initialProps: { valeurs: { motCle: 'boulanger' } } },
		);
		act(() => result.current.reinitialiser());

		rerender({ valeurs: { motCle: 'boulanger' } });

		expect(result.current.valeursInitiales).toEqual({});
	});
});
