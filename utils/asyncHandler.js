const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // Pass any errors to the express error handler
    };
};

module.exports = asyncHandler;
