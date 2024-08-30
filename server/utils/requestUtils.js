
/**
Check if the client request content type is JSON.*
@param {http.IncomingMessage} request - The HTTP incoming message object.
@returns {boolean} True if the client request content type is JSON, false otherwise.
*/
const isJson = request => {
    const contentType = request.headers['content-type'];
    if (contentType && contentType.toLowerCase() === 'application/json') {
      return true;
    }
    return false;
  };

  module.exports = {isJson};