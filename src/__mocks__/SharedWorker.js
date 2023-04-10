import CustomSharedWorker from "./MockSharedWorker";

class MockSharedWorker extends CustomSharedWorker {
  constructor(script) {
    super(script);
  }
}

export default MockSharedWorker;
