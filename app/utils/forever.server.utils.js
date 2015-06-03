'use strict';

// Helper function to have an infinite loop using Promises
function forever (fn) {
    return fn().then(() => {
        return forever(fn);  // re-execute if successful
    });
}

module.exports = forever;