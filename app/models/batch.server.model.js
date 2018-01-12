'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const batchSchema = new Schema({
    batchId: {
        type: String,
        trim: true,
        index: { unique: true },
        required: 'batchId cannot be blank'
    }
}, { capped: true, size: 200000000 });

mongoose.model('Batch', batchSchema);

