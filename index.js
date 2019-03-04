class RequestRestreamer {
  constructor(request) {
    this.dataChunks = [];
    this.streamClosed = false;
    this.request = request;

    request.on('data', chunk => this.dataChunks.push(chunk));
    request.on('end', () => this.streamClosed = true);
  }

  restream() {
    if (!this.streamClosed) {
      setImmediate(this.restream());
    }

    this.streamClosed = false;
    this.request.removeAllListeners('data');
    this.request.removeAllListeners('end');

    process.nextTick(() => {
      this.dataChunks.forEach(chunk => this.request.emit('data', chunk));
      this.request.emit('end');
      this.streamClosed = true;
    });
  }
}

module.exports = RequestRestreamer;
