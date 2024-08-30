/**
 * Helper functions for sending HTTP responses with corresponding status codes and error messages.
 * @module responseUtils
 */

// 1xx Informational
const continueResponse = (res, message) => res.status(100).json({ message: message });
const switchingProtocols = (res, message) => res.status(101).json({ message: message });
const processing = (res, message) => res.status(102).json({ message: message });
const earlyHints = (res, message) => res.status(103).json({ message: message });

// 2xx Success
const ok = (res, message, data) => res.status(200).json({ message: message, data: data});
const created = (res, message) => res.status(201).json({ message: message });
const accepted = (res, message) => res.status(202).json({ message: message });
const nonAuthoritativeInformation = (res, message) => res.status(203).json({ message: message });
const noContent = (res, message) => res.status(204).json({ message: message });
const resetContent = (res, message) => res.status(205).json({ message: message });
const partialContent = (res, message) => res.status(206).json({ message: message });
const multiStatus = (res, message) => res.status(207).json({ message: message });
const alreadyReported = (res, message) => res.status(208).json({ message: message });
const imUsed = (res, message) => res.status(226).json({ message: message });

// 3xx Redirection
const multipleChoices = (res, message) => res.status(300).json({ message: message });
const movedPermanently = (res, message) => res.status(301).json({ message: message });
const found = (res, message) => res.status(302).json({ message: message });
const seeOther = (res, message) => res.status(303).json({ message: message });
const notModified = (res, message) => res.status(304).json({ message: message });
const temporaryRedirect = (res, message) => res.status(307).json({ message: message });
const permanentRedirect = (res, message) => res.status(308).json({ message: message });

// 4xx Client Error
const badRequest = (res, message) => res.status(400).json({ error: message });
const unauthorized = (res, message) => res.status(401).json({ error: message });
const paymentRequired = (res, message) => res.status(402).json({ error: message });
const forbidden = (res, message) => res.status(403).json({ error: message });
const notFound = (res, message) => res.status(404).json({ error: message });
const methodNotAllowed = (res, message) => res.status(405).json({ error: message });
const notAcceptable = (res, message) => res.status(406).json({ error: message });
const proxyAuthenticationRequired = (res, message) => res.status(407).json({ error: message });
const requestTimeout = (res, message) => res.status(408).json({ error: message });
const conflict = (res, message) => res.status(409).json({ error: message });
const gone = (res, message) => res.status(410).json({ error: message });
const lengthRequired = (res, message) => res.status(411).json({ error: message });
const preconditionFailed = (res, message) => res.status(412).json({ error: message });
const payloadTooLarge = (res, message) => res.status(413).json({ error: message });
const uriTooLong = (res, message) => res.status(414).json({ error: message });
const unsupportedMediaType = (res, message) => res.status(415).json({ error: message });
const rangeNotSatisfiable = (res, message) => res.status(416).json({ error: message });
const expectationFailed = (res, message) => res.status(417).json({ error: message });
const imATeapot = (res, message) => res.status(418).json({ error: message });
const misdirectedRequest = (res, message) => res.status(421).json({ error: message });
const unprocessableEntity = (res, message) => res.status(422).json({ error: message });
const locked = (res, message) => res.status(423).json({ error: message });
const failedDependency = (res, message) => res.status(424).json({ error: message });
const tooEarly = (res, message) => res.status(425).json({ error: message });
const upgradeRequired = (res, message) => res.status(426).json({ error: message });
const preconditionRequired = (res, message) => res.status(428).json({ error: message });
const tooManyRequests = (res, message) => res.status(429).json({ error: message });
const requestHeaderFieldsTooLarge = (res, message) => res.status(431).json({ error: message });
const unavailableForLegalReasons = (res, message) => res.status(451).json({ error: message });

// 5xx Server Error
const internalServerError = (res, message) => res.status(500).json({ error: message });
const notImplemented = (res, message) => res.status(501).json({ error: message });
const badGateway = (res, message) => res.status(502).json({ error: message });
const serviceUnavailable = (res, message) => res.status(503).json({ error: message });
const gatewayTimeout = (res, message) => res.status(504).json({ error: message });
const httpVersionNotSupported = (res, message) => res.status(505).json({ error: message });
const variantAlsoNegotiates = (res, message) => res.status(506).json({ error: message });
const insufficientStorage = (res, message) => res.status(507).json({ error: message });
const loopDetected = (res, message) => res.status(508).json({ error: message });
const notExtended = (res, message) => res.status(510).json({ error: message });
const networkAuthenticationRequired = (res, message) => res.status(511).json({ error: message });


//for get routes
const sendJson = (res, payload, code) => {
    return res.status(code).json(payload);
}

module.exports = {
    continueResponse,
    switchingProtocols,
    processing,
    earlyHints,
    ok,
    created,
    accepted,
    nonAuthoritativeInformation,
    noContent,
    resetContent,
    partialContent,
    multiStatus,
    alreadyReported,
    imUsed,
    multipleChoices,
    movedPermanently,
    found,
    seeOther,
    notModified,
    temporaryRedirect,
    permanentRedirect,
    badRequest,
    unauthorized,
    paymentRequired,
    forbidden,
    notFound,
    methodNotAllowed,
    notAcceptable,
    proxyAuthenticationRequired,
    requestTimeout,
    conflict,
    gone,
    lengthRequired,
    preconditionFailed,
    payloadTooLarge,
    uriTooLong,
    unsupportedMediaType,
    rangeNotSatisfiable,
    expectationFailed,
    imATeapot,
    misdirectedRequest,
    unprocessableEntity,
    locked,
    failedDependency,
    tooEarly,
    upgradeRequired,
    preconditionRequired,
    tooManyRequests,
    requestHeaderFieldsTooLarge,
    unavailableForLegalReasons,
    internalServerError,
    notImplemented,
    badGateway,
    serviceUnavailable,
    gatewayTimeout,
    httpVersionNotSupported,
    variantAlsoNegotiates,
    insufficientStorage,
    loopDetected,
    notExtended,
    networkAuthenticationRequired,
    sendJson
  };