// retries a failed promise 3x before giving up

const retry3x = fn => {

    const attempt = async (...callArgs) => {
        try {
            return await fn(...callArgs);
        } catch (e) {
            console.log('reattempting ', callArgs);
            return await fn(...callArgs);
        }

    };

    return attempt;

};

module.exports = retry3x;
