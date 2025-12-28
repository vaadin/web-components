import { MockHttpRequest } from './mock-http-request.js';

export const touchDevice = (function () {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (_) {
    return false;
  }
})();

let fileCounter = 0;

/**
 * Creates a File suitable to add to FormData.
 */
export function createFile(fileSize, contentType) {
  const array = [];
  for (let i = 0; i < (fileSize || 512); i++) {
    array.push('A');
  }
  const file = new Blob([new Uint8Array(array)], { type: contentType || 'application/x-octet-stream' });
  file.name = `file-${fileCounter}`;
  fileCounter += 1;
  return file;
}

/**
 * Creates an array of Files suitable to add to FormData.
 */
export function createFiles(arraySize, fileSize, contentType) {
  const files = [];
  for (let i = 0; i < arraySize; i++) {
    files.push(createFile(fileSize, contentType));
  }
  return files;
}

/**
 * Creates a FileSystemFileEntry object suitable to be used in a DataTransferItem.
 */
export function createFileSystemFileEntry(fileSize, contentType) {
  const file = createFile(fileSize, contentType);
  return {
    isFile: true,
    isDirectory: false,
    file(callback) {
      callback(file);
    },
    _file: file, // expose the file for assertions
  };
}

/**
 * Creates a FileSystemFileEntry object that returns an error when trying to read the file.
 */
export function createUnreadableFileSystemFileEntry() {
  return {
    isFile: true,
    isDirectory: false,
    file(_, errorCallback) {
      if (errorCallback) {
        errorCallback(new DOMException('File could not be read'));
      }
    },
  };
}

/**
 * Creates a FileSystemDirectoryEntry object suitable to be used in a DataTransferItem.
 */
export function createFileSystemDirectoryEntry(fileEntries) {
  return {
    isFile: false,
    isDirectory: true,
    createReader() {
      return {
        readEntries(callback) {
          callback(fileEntries);
        },
      };
    },
  };
}

/**
 * Creates a FileSystemDirectoryEntry object that returns an error when trying to read the directory.
 */
export function createUnreadableFileSystemDirectoryEntry() {
  return {
    isFile: false,
    isDirectory: true,
    createReader() {
      return {
        readEntries(_, errorCallback) {
          if (errorCallback) {
            errorCallback(new DOMException('Directory could not be read'));
          }
        },
      };
    },
  };
}

/**
 * Creates xhr objects configured for testing
 *
 *  @param cfg Object
 *     size: size of the request
 *     connectTime: time to sleep before notifying any progress
 *     uploadTime: time to spend
 *     stepTime: time between two progress updates
 *     serverTime: time to sleep in server after progress is 100%
 *     serverMessage: the payload sent by server.
 *     serverType: the contentType of the serverResponse.
 *     serverValidation: a function run once the file has been sent.
 */
export function xhrCreator(c) {
  c ||= {};
  const cfg = {
    size: c.size || 100,
    connectTime: c.connectTime || 10,
    uploadTime: c.uploadTime || 10,
    stepTime: c.stepTime || 5,
    serverTime: c.serverTime || 10,
    serverMessage: c.message || '{"message": "ok"}',
    serverType: c.serverType || 'application/json',
    serverValidation: c.serverValidation || function () {},
  };
  return function () {
    const xhr = new MockHttpRequest();
    xhr.upload = {
      onprogress() {},
    };
    xhr.abort = function () {
      if (xhr.onabort) {
        xhr.onabort();
      }
    };
    xhr.onsend = function () {
      if (xhr.upload.onloadstart) {
        xhr.upload.onloadstart();
      }
      const total = cfg.size;
      let done = 0;
      const step = (total / cfg.uploadTime) * cfg.stepTime;

      function finish() {
        const error = cfg.serverValidation(xhr);
        if (error) {
          xhr.setResponseHeader('Content-Type', cfg.serverType);
          const status = error.status || 500;
          const statusText = error.statusText || error;
          xhr.receive(status, { error: statusText });
        } else if (xhr.readyState === 0) {
          xhr.onreadystatechange();
        } else if (xhr.readyState < 4) {
          xhr.setResponseHeader('Content-Type', cfg.serverType);
          xhr.receive(200, cfg.serverMessage);
        }
      }

      function progress() {
        xhr.upload.onprogress({ total, loaded: done });
        if (done < total) {
          setTimeout(progress, cfg.stepTime);
          done = Math.min(total, done + step);
        } else {
          setTimeout(finish, cfg.serverTime);
        }
      }

      function start() {
        setTimeout(progress, cfg.connectTime);
      }

      start();
    };
    return xhr;
  };
}

/**
 * Removes a file at given index.
 */
export function removeFile(upload, idx = 0) {
  const files = upload.querySelectorAll('vaadin-upload-file');
  const file = files[idx];
  file.shadowRoot.querySelector('[part="remove-button"]').click();
}
