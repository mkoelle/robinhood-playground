// retries a failed promise 3x before giving up

const retry3x = fn => {


    let attempts = 0;
    const attempt = async (...callArgs) => {

        try {
            const returnVal = await fn(...callArgs);
            if (returnVal && attempts) {
                console.log('fixed', callArgs, attempts);
            }
            return returnVal;
        } catch (e) {
            if (attempts < 3) {
                console.log('reattempting ', attempts, callArgs);
                attempts++;
                return attempt(...callArgs);
            }
        }

    };

    return attempt;

};

module.exports = retry3x;
