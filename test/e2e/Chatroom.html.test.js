import '@babel/polyfill';
import puppeteer from "puppeteer";
jest.setTimeout(10000);

describe("Chatroom.html", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            defaultViewport: null,
            headless: true
        });
        page = await browser.newPage();
    });

    it("Loads the chatroom", async () => {
        await page.goto("http://localhost:8080/examples/chatroom.html#anand", { waitUntil: 'domcontentloaded' });
        await page.waitForXPath("//*[@id='chat-room' and contains(., 'anand')]");
        const chatroom = await page.$("#chat-room");
        const messages = await chatroom.$$("#chat-sender");

        expect(messages.length).toEqual(1);
    });

    it("Send and receives messages", async () => {
        const page2 = await browser.newPage();
        await page.goto("http://localhost:8080/examples/chatroom.html#anand", { waitUntil: 'domcontentloaded' });
        await page.waitForXPath("//*[@id='chat-room' and contains(., 'anand')]");

        await page2.goto("http://localhost:8080/examples/chatroom.html#john", { waitUntil: 'domcontentloaded' });
        await page2.waitForXPath("//*[@id='chat-room' and contains(., 'john')]");

        await page.bringToFront();
        const inputArea = await page.$("#chat-message-input");
        const submitButton = await page.$("[type='submit']");
        await inputArea.type("Hello world!");
        await submitButton.click();
        await page.waitForTimeout(1000);

        const chatroom = await page.$("#chat-room");
        const messages = await chatroom.$$("#chat-sender");


        await page2.bringToFront();
        const chatroomOnPageTwo = await page2.$("#chat-room");
        const messagesOnPageTwo = await chatroomOnPageTwo.$$("#chat-sender");

        expect(messages.length).toEqual(3);
        expect(messagesOnPageTwo.length).toEqual(2);
        await page2.close();
    })

    it("Updates members list", async () => {
        const page2 = await browser.newPage();
        
        //Open page 1, should have 1 member
        await page.goto("http://localhost:8080/examples/chatroom.html#anand", { waitUntil: 'domcontentloaded' });
        await page.waitForXPath("//*[@id='chat-room' and contains(., 'anand')]");

        await page.bringToFront();
        let memberList = await page.$("#members-list");
        let members = await memberList.$$("#member-name");

        expect(members.length).toEqual(1);

        //Open another page, it should show 2 members 
        await page2.goto("http://localhost:8080/examples/chatroom.html#john", { waitUntil: 'domcontentloaded' });
        await page2.waitForXPath("//*[@id='chat-room' and contains(., 'john')]");

        await page2.bringToFront();
        const memberListOnPageTwo = await page.$("#members-list");
        const membersOnPageTwo = await memberListOnPageTwo.$$("#member-name");

        expect(membersOnPageTwo.length).toEqual(2);

        //Page 1 should have been updated to show 2 members
        await page.bringToFront();
        memberList = await page.$("#members-list");
        members = await memberList.$$("#member-name");

        expect(members.length).toEqual(2);

        //Close page 2 and, page 1 should show single member once again
        await page2.close();
        await page.waitForTimeout(1000);
        memberList = await page.$("#members-list");
        members = await memberList.$$("#member-name");

        expect(members.length).toEqual(1);
    })

    afterAll(() => browser.close());
});