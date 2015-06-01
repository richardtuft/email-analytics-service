'use strict';

function NoMessageInQueueError() {
    this.name = 'NoMessageInQueueError';
    this.message = 'The are no messages in the queue';
}
NoMessageInQueueError.prototype = Object.create(Error.prototype);
NoMessageInQueueError.prototype.constructor = NoMessageInQueueError;

module.exports = NoMessageInQueueError;
