import { JeRecrute } from '~/client/components/features/JeRecrute/JeRecrute';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/je-recrute/index.analytics';

export default function JeRecrutePage () {
	useAnalytics(analytics);

	return (
		<JeRecrute />
	);
}
