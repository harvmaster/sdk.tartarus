import { Worker } from "worker_threads";

class CustomSharedWorker {
  private worker: Worker;
  public port: MessagePort;

  constructor(script: string) {
    this.worker = new Worker(script);
    this.port = new MessagePort();

    this.worker.on("message", (event: MessageEvent) => {
      this.port.dispatchEvent(event);
    });
  }
}

export default CustomSharedWorker;
