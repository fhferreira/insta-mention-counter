const puppeteer = require('puppeteer');

// Read instagram post
async function start() {

    async function loadMore(page, selector) {
        const moreButton = await page.$(selector);
        if (moreButton) {
            console.log('More +');
            await moreButton.click();
            await page.waitFor(selector, {timeout: 3000}).catch(() => {console.log('timeout')});
            await loadMore(page, selector);
        }
    }

    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText ));
        return comments;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const url = 'https://www.instagram.com/p/CChMVvQgYKK';
    await page.goto(url);

    const selector = '.dCJp8';
    await loadMore(page, selector);

    const selectorComment = '.C4VMK span a';
    const comments = await getComments(page, selectorComment);

    const counted = count(comments);

    const sorted = sort(counted);

    sorted.forEach(mention => { console.log(mention) });

    await browser.close();
}

// Get comments
const fakeArrobas = [
    '@fhferreira',
    '@fhferreira',
    '@fhferreira3',
    '@fhferreira',
    '@fhferreira1',
    '@fhferreira2',
    '@fhferreira',
    '@fhferreira3',
    '@fhferreira3',
    '@fhferreira3',
    '@fhferreira4',
    '@fhferreira4',
    '@fhferreira3',
    '@fhferreira5'
];

// Count mentions
function count(arrobas) {
    const count = {};
    arrobas.forEach(arroba => {
        count[arroba] = (count[arroba]||0) + 1;
    });

    return count;
}

// Sort mentions
function sort(counted) {
    // const entries = [];
    //for(prop in counted) {
    //    entries.push([prop, counted[prop]]);
    //}
    
    const entries = Object.entries(counted);

    const sorted = entries.sort((a,b) => { 
        return b[1] - a[1];
    });

    return sorted;
}

start();