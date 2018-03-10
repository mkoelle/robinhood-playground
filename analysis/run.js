const login = require('../rh-actions/login');


// node analysis/run [filename goes here]

(async () => {
    let Robinhood = await login();
    const relatedAnalysisFn = require(`./${process.argv.pop()}`);
    const response = await relatedAnalysisFn(Robinhood);
    console.log('response');
    console.log(JSON.stringify(response, null, 2));
})();
