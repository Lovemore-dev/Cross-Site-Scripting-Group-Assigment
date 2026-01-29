1. The XSS Hack (Stealing Info)
    The Problem: 
    The website takes a user's review and puts it directly on the page using .innerHTML.

    The Attack: 
    An attacker writes a review with a "hidden" script: Great product! <img src="x" onerror="alert('Hacked! Your Cookie: ' + document.cookie)">

    The Result: 
    Every user who visits the page sees an alert box because the browser runs the attacker's code.

    The Fix: 
    1. Clean the text before saving it using a library called DOMPurify. 
    2. Display as text, not HTML, by using .textContent instead of .innerHTML.

2. The CSRF Hack (Fake Orders)
   The Problem: 
   The server processes payments without checking where the request came from.

   The Attack: 
   An attacker sends you to a fake page (csrf.html) that automatically tells your browser to "Pay 999,999" to the real store.

   The Result: 
   Since you are already logged in, the server thinks you made the purchase.

   The Fix: 
   1. Check the Origin: Tell the server to only accept requests coming from http://localhost:3000. 
   2. Add Security Headers: Use the Helmet library to add extra layers of protection to your website.

            How to use this Lab
Install tools: npm install express mongoose helmet dompurify jsdom

Run it: node server.js

To be Vulnerable: Leave the security code commented out.
Then run the review given in storedxss.txt
Then keep the browser open and open the crsf.html file in another browser

To be Secure: Uncomment the security lines in server.js and index.html.
Try the attack and it will be blocked
