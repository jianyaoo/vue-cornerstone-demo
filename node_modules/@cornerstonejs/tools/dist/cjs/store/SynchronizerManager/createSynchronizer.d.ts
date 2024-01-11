import Synchronizer from './Synchronizer';
import { ISynchronizerEventHandler } from '../../types';
declare function createSynchronizer(synchronizerId: string, eventName: string, eventHandler: ISynchronizerEventHandler, options?: any): Synchronizer;
export default createSynchronizer;
