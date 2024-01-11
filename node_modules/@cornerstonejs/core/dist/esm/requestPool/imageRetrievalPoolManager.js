import { RequestPoolManager } from './requestPoolManager';
import RequestType from '../enums/RequestType';
const imageRetrievalPoolManager = new RequestPoolManager('imageRetrievalPool');
imageRetrievalPoolManager.setMaxSimultaneousRequests(RequestType.Interaction, 200);
imageRetrievalPoolManager.setMaxSimultaneousRequests(RequestType.Thumbnail, 200);
imageRetrievalPoolManager.setMaxSimultaneousRequests(RequestType.Prefetch, 200);
imageRetrievalPoolManager.grabDelay = 0;
export default imageRetrievalPoolManager;
//# sourceMappingURL=imageRetrievalPoolManager.js.map