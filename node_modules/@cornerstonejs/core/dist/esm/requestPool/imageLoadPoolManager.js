import { RequestPoolManager } from './requestPoolManager';
import RequestType from '../enums/RequestType';
const imageLoadPoolManager = new RequestPoolManager('imageLoadPool');
imageLoadPoolManager.grabDelay = 0;
imageLoadPoolManager.setMaxSimultaneousRequests(RequestType.Interaction, 1000);
imageLoadPoolManager.setMaxSimultaneousRequests(RequestType.Thumbnail, 1000);
imageLoadPoolManager.setMaxSimultaneousRequests(RequestType.Prefetch, 1000);
export default imageLoadPoolManager;
//# sourceMappingURL=imageLoadPoolManager.js.map