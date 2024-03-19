import '@babel/polyfill';
import puppeteer from "puppeteer";
jest.setTimeout(10000);

describe("Chatroom.html", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            args: [ '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream' ],
            defaultViewport: null,
            headless: true
        });
        page = await browser.newPage();
    });

    it("Loads the room and self video", async () => {
        await page.goto("http://localhost:8080/examples/videoroom.html#anand", { waitUntil: 'domcontentloaded' });
        await page.waitForXPath("//*[@id='members-list' and contains(., 'anand')]");

        const membersList = await page.$("#members-list");
        const members = await membersList.$$("#member-name");
        expect(members.length).toBeGreaterThanOrEqual(1);

        const videos = await page.$$("video");
        expect(videos.length).toEqual(1);
    });


    it("Adds and removes video participants", async () => {
        await page.goto("http://localhost:8080/examples/videoroom.html#anand", { waitUntil: 'domcontentloaded' });
        await page.waitForXPath("//*[@id='members-list' and contains(., 'anand')]");

        const membersList = await page.$("#members-list");
        const members = await membersList.$$("#member-name");
        expect(members.length).toBeGreaterThanOrEqual(1);

        let videos = await page.$$("video");
        expect(videos.length).toEqual(1);

        //Open another page
        const page2 = await browser.newPage();
        await page2.goto("http://localhost:8080/examples/videoroom.html#john", { waitUntil: 'domcontentloaded' });
        await page2.waitForXPath("//*[@id='members-list' and contains(., 'john')]");
        await page2.waitForTimeout(2000);

        const videosOnPageTwo = await page2.$$("video");
        expect(videosOnPageTwo.length).toEqual(2);

        
        //Check back page 1
        page.bringToFront();
        videos = await page.$$("video");
        expect(videos.length).toEqual(2);

        //Check after removing page 2
        await page2.close();
        await page.waitForTimeout(1000);
        videos = await page.$$("video");
        expect(videos.length).toEqual(1);
    });

    it("Updates members list", async () => {
        await page.goto("http://localhost:8080/examples/videoroom.html#anand", { waitUntil: 'domcontentloaded' });
        await page.waitForXPath("//*[@id='members-list' and contains(., 'anand')]");

        let membersList = await page.$("#members-list");
        let members = await membersList.$$("#member-name");
        expect(members.length).toBeGreaterThanOrEqual(1);

        let videos = await page.$$("video");
        expect(videos.length).toEqual(1);

        //Open another page
        const page2 = await browser.newPage();
        await page2.goto("http://localhost:8080/examples/videoroom.html#john", { waitUntil: 'domcontentloaded' });
        await page2.waitForXPath("//*[@id='members-list' and contains(., 'john')]");
        await page2.waitForTimeout(2000);

        let membersListOnPageTwo = await page.$("#members-list");
        let membersOnPageTwo = await membersListOnPageTwo.$$("#member-name");
        expect(membersOnPageTwo.length).toEqual(2);

        
        //Check back page 1
        page.bringToFront();
        membersList = await page.$("#members-list");
        members = await membersList.$$("#member-name");
        expect(members.length).toBeGreaterThanOrEqual(2);

        //Check after removing page 2
        await page2.close();
        await page.waitForTimeout(700);
        membersList = await page.$("#members-list");
        members = await membersList.$$("#member-name");
        expect(members.length).toBeGreaterThanOrEqual(1);
        
    });

    afterAll(() => browser.close());
});