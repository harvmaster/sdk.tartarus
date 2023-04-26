// The shared worker is a singleton that is used to share data between the frontend webapp and the service worker
// The service worker is a singleton that is used to handle background tasks such as push notifications and background sync
// The service worker is also used to cache data for offline use
// The Shared Worker will provide an instance of the Database for both of these to read from and write to

import SharedWorker from './SharedWorkerPolyfill'

export class SharedWorkerWrapper {
  private static instance: SharedWorker;

  private constructor() {
  }

  public static getInstance(): SharedWorker {
    if (!SharedWorkerWrapper.instance) {
      SharedWorkerWrapper.instance = new SharedWorker('./src/workers/SharedWorker.js') as SharedWorker;
      // await SharedWorkerWrapper.instance.init();
    }

    return SharedWorkerWrapper.instance;
  }
}

export default SharedWorkerWrapper