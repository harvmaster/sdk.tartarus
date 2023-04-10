class SharedWorkerPolyfill {
  _worker: any;
  port: { 
    postMessage: (message: any) => any;
    addEventListener: (type: any, listener: any) => any;
    removeEventListener: (type: any, listener: any) => any;
    start: () => void;
  };
  
  constructor(scriptURL: string, options = {}) {
    const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
    const isBrowser = typeof window !== 'undefined';

    if (isNode) {
      const { Worker } = require('worker_threads');
      this._worker = new Worker(scriptURL, options);
    } else if (isBrowser && typeof SharedWorker !== 'undefined') {
      this._worker = new SharedWorker(scriptURL, options);
    } else {
      throw new Error('Unsupported environment: Neither Node.js nor a browser with SharedWorker support detected.');
    }

    if (isNode) {
      this.port = {
        postMessage: (message) => this._worker.postMessage({ data: message }),
        addEventListener: (type, listener) => this._worker.on(type, listener),
        removeEventListener: (type, listener) => this._worker.off(type, listener),
        start: () => {},
      };
    } else {
      this.port = this._worker.port;
    }
  }
}

export default (typeof SharedWorker !== 'undefined') ? SharedWorker : SharedWorkerPolyfill;
