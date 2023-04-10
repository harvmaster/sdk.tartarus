var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
var isBrowser = typeof window !== 'undefined';
var sendMessage;
if (isNode) {
    require('fake-indexeddb/auto');
    var IDBFactory_1 = require('fake-indexeddb').IDBFactory;
    // @ts-ignore
    // indexedDb = new IDBFactory()
    var parentPort_1 = require('worker_threads').parentPort;
    parentPort_1.on('message', function (event) { return handleMessage(event); });
    sendMessage = function (data) {
        parentPort_1.postMessage(data);
    };
}
else if (isBrowser) {
    self.onmessage = function (event) { return handleMessage(event); };
    sendMessage = function (data) {
        self.postMessage(data);
    };
}
else {
    throw new Error('Unsupported environment: Neither Node.js nor a browser detected.');
}
var version = 1;
function openMyDatabase(v, onUpgrade) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (v === undefined)
                        v = version;
                    var openRequest = indexedDB.open('myDatabase', v);
                    openRequest.onsuccess = function () {
                        version = openRequest.result.version;
                        resolve(openRequest.result);
                    };
                    openRequest.onerror = function () {
                        reject(openRequest.error);
                    };
                    openRequest.onblocked = function () {
                        reject(new Error('Database is blocked'));
                    };
                    openRequest.onupgradeneeded = function (event) {
                        var db = openRequest.result;
                        if (onUpgrade)
                            return onUpgrade(db);
                        createObjectStores(db, []);
                    };
                })];
        });
    });
}
function createObjectStores(db, schemas) {
    for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {
        var schema = schemas_1[_i];
        if (!db.objectStoreNames.contains(schema.name)) {
            var objectStore = db.createObjectStore(schema.name, {
                keyPath: schema.keyPath,
                autoIncrement: schema.autoIncrement
            });
            for (var _a = 0, _b = schema.indices; _a < _b.length; _a++) {
                var index = _b[_a];
                objectStore.createIndex(index.name, index.keyPath, index.options);
            }
        }
    }
}
function updateObjectStores(schemas) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openMyDatabase(version + 1, function (upgradingDb) {
                        createObjectStores(upgradingDb, schemas);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleMessage(event) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, requestId, requestType, payload, db, _b, storeName, query_1, indexName, tx, store, source, records_1, cursorRequest, storeName, query_2, indexName, tx, store, source, cursorRequest, storeName, id, tx, store, storeName, query_3, update_1, indexName, tx, store, source, updatedRecords_1, cursorRequest, storeName, query_4, update_2, indexName, tx, store, source, updatedRecord_1, cursorRequest, storeName, query_5, indexName, tx, store, source, cursorRequest, deleted_1, storeName, query_6, indexName, tx, store, source, cursorRequest, storeName, record, tx, store, addRequest_1, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = event.data, requestId = _a.requestId, requestType = _a.requestType, payload = _a.payload;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 14, , 15]);
                    return [4 /*yield*/, openMyDatabase()];
                case 2:
                    db = _c.sent();
                    _b = requestType;
                    switch (_b) {
                        case 'find': return [3 /*break*/, 3];
                        case 'findOne': return [3 /*break*/, 4];
                        case 'findById': return [3 /*break*/, 5];
                        case 'findAndUpdate': return [3 /*break*/, 6];
                        case 'findOneAndUpdate': return [3 /*break*/, 7];
                        case 'delete': return [3 /*break*/, 8];
                        case 'deleteOne': return [3 /*break*/, 9];
                        case 'create': return [3 /*break*/, 10];
                        case 'createObjectStores': return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 3:
                    {
                        storeName = payload.storeName, query_1 = payload.query, indexName = payload.index;
                        tx = db.transaction(storeName, 'readonly');
                        store = tx.objectStore(storeName);
                        source = indexName ? store.index(indexName) : store;
                        records_1 = [];
                        cursorRequest = source.openCursor();
                        cursorRequest.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                var record_1 = cursor.value;
                                var isMatch = Object.entries(query_1).every(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return record_1[key] === value;
                                });
                                if (isMatch) {
                                    records_1.push(record_1);
                                }
                                cursor["continue"]();
                            }
                            else {
                                sendMessage({ requestId: requestId, result: records_1 });
                            }
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 4;
                case 4:
                    {
                        storeName = payload.storeName, query_2 = payload.query, indexName = payload.index;
                        tx = db.transaction(storeName, 'readonly');
                        store = tx.objectStore(storeName);
                        source = indexName ? store.index(indexName) : store;
                        cursorRequest = source.openCursor();
                        cursorRequest.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                var record_2 = cursor.value;
                                var isMatch = Object.entries(query_2).every(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return record_2[key] === value;
                                });
                                if (isMatch) {
                                    return sendMessage({ requestId: requestId, result: record_2 });
                                }
                                cursor["continue"]();
                            }
                            else {
                                sendMessage({ requestId: requestId, result: null });
                            }
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 5;
                case 5:
                    {
                        storeName = payload.storeName, id = payload.id;
                        tx = db.transaction(storeName, 'readonly');
                        store = tx.objectStore(storeName);
                        store.get(id).onsuccess = function (event) {
                            var record = event.target.result;
                            sendMessage({ requestId: requestId, result: record });
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 6;
                case 6:
                    {
                        storeName = payload.storeName, query_3 = payload.query, update_1 = payload.update, indexName = payload.index;
                        tx = db.transaction(storeName, 'readwrite');
                        store = tx.objectStore(storeName);
                        source = indexName ? store.index(indexName) : store;
                        updatedRecords_1 = [];
                        cursorRequest = source.openCursor();
                        cursorRequest.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                var record_3 = cursor.value;
                                var isMatch = Object.entries(query_3).every(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return record_3[key] === value;
                                });
                                if (isMatch) {
                                    var updatedRecord = Object.assign({}, cursor.value, update_1);
                                    updatedRecords_1.push(updatedRecord);
                                    cursor.update(updatedRecord);
                                }
                                cursor["continue"]();
                            }
                        };
                        tx.oncomplete = function () {
                            sendMessage({ requestId: requestId, result: updatedRecords_1 });
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 7;
                case 7:
                    {
                        storeName = payload.storeName, query_4 = payload.query, update_2 = payload.update, indexName = payload.index;
                        tx = db.transaction(storeName, 'readwrite');
                        store = tx.objectStore(storeName);
                        source = indexName ? store.index(indexName) : store;
                        updatedRecord_1 = null;
                        cursorRequest = source.openCursor();
                        cursorRequest.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                var record_4 = cursor.value;
                                var isMatch = Object.entries(query_4).every(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return record_4[key] === value;
                                });
                                if (isMatch) {
                                    updatedRecord_1 = Object.assign({}, cursor.value, update_2);
                                    cursor.update(updatedRecord_1);
                                }
                                else {
                                    cursor["continue"]();
                                }
                            }
                        };
                        tx.oncomplete = function () {
                            sendMessage({ requestId: requestId, result: updatedRecord_1 });
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 8;
                case 8:
                    {
                        storeName = payload.storeName, query_5 = payload.query, indexName = payload.indexName;
                        tx = db.transaction(storeName, 'readwrite');
                        store = tx.objectStore(storeName);
                        source = indexName ? store.index(indexName) : store;
                        cursorRequest = source.openCursor();
                        deleted_1 = 0;
                        cursorRequest.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                var record_5 = cursor.value;
                                var isMatch = Object.entries(query_5).every(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return record_5[key] === value;
                                });
                                if (isMatch) {
                                    cursor["delete"]();
                                    deleted_1++;
                                }
                                cursor["continue"]();
                            }
                        };
                        tx.oncomplete = function () {
                            sendMessage({ requestId: requestId, result: deleted_1 });
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 9;
                case 9:
                    {
                        storeName = payload.storeName, query_6 = payload.query, indexName = payload.indexName;
                        tx = db.transaction(storeName, 'readwrite');
                        store = tx.objectStore(storeName);
                        source = indexName ? store.index(indexName) : store;
                        cursorRequest = source.openCursor();
                        cursorRequest.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                var record_6 = cursor.value;
                                var isMatch = Object.entries(query_6).every(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return record_6[key] === value;
                                });
                                if (isMatch) {
                                    cursor["delete"]();
                                }
                                else {
                                    cursor["continue"]();
                                }
                            }
                        };
                        tx.oncomplete = function () {
                            sendMessage({ requestId: requestId, result: true });
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 10;
                case 10:
                    {
                        storeName = payload.storeName, record = payload.record;
                        tx = db.transaction(storeName, 'readwrite');
                        store = tx.objectStore(storeName);
                        addRequest_1 = store.add(record);
                        addRequest_1.onsuccess = function (event) {
                            var key = event.target.result;
                            sendMessage({ requestId: requestId, result: key });
                        };
                        addRequest_1.onerror = function (event) {
                            sendMessage({ requestId: requestId, error: addRequest_1.error });
                        };
                        return [3 /*break*/, 13];
                    }
                    _c.label = 11;
                case 11:
                    // Close db before upgrading
                    db.close();
                    // upgrade with schemas
                    return [4 /*yield*/, updateObjectStores(payload.schemas)];
                case 12:
                    // upgrade with schemas
                    _c.sent();
                    sendMessage({ requestId: requestId, result: true });
                    return [3 /*break*/, 13];
                case 13:
                    db.close();
                    return [3 /*break*/, 15];
                case 14:
                    error_1 = _c.sent();
                    console.log(error_1);
                    sendMessage({ requestId: requestId, error: error_1.message });
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
;
