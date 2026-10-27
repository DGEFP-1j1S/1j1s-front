import Avantages from '~/client/components/features/JeRecruteAfprPoei/Avantages/Avantages';
import { CommentCaMarche } from '~/client/components/features/JeRecruteAfprPoei/CommentCaMarche/CommentCaMarche';
import RecrutementCandidatFranceTravail from '~/client/components/features/JeRecruteAfprPoei/RecrutementCandidatFranceTravail/RecrutementCandidatFranceTravail';
import BanniereRejoindreLaMobilisation
	from '~/client/components/ui/Baniere/BanniereRejoindreLaMobilisation/BanniereRejoindreLaMobilisation';

export default function JeRecruteAfprPoei() {
	return (
		<>
			<RecrutementCandidatFranceTravail />
			<Avantages />
			<CommentCaMarche />
			<BanniereRejoindreLaMobilisation />
		</>
	);
}
