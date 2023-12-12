Steps to run the project
1. Clone the repo
2. Checkout master branch 
<!-- Using master for now, bad practice I know. -->
3. Install the deps using npm i
4. Get your sendgrid api key from their website https://app.sendgrid.com/
5. Get an app password for your email account, in this case gmail is being used.
6. Run the project using command: npm run dev
7. Hit the endpoint localhost:3000/send-email to receive x emails where x is the count of emails in the email.xlsx file.