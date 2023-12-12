import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';
import config from './config';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import xlsx from 'xlsx';
import * as csvWriter from 'csv-writer';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

sgMail.setApiKey(config.sendGridApiKey);
// sgClient.setApiKey(config.sendGridApiKey);

export const sendEmail = async (req, res) => {
    try {
        const excelData = readExcel(path.join(__dirname, 'emails.xlsx'));
        const csvFilePath = path.join(__dirname, 'email_responses.csv');

        // Loop through Excel data and send emails
        const writer = csvWriter.createObjectCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'email', title: 'Email Address' },
                { id: 'statusCode', title: 'HTTP Status Code' },
                { id: 'messageId', title: 'Message ID' },
                { id: 'timestamp', title: 'Timestamp' },
            ],
            append: true,
        });
        for (const row of excelData) {
            const { Email: toEmail } = row;
            const mailOptions = {
                from: config.gmail.email,
                to: row.Email,
                subject: row.Subject,
                text: row.Message,
            };
            console.log(toEmail);
            const [response] = await sgMail.send(mailOptions);
            const { headers: { 'x-message-id': messageId }, statusCode } = response;
            console.log('Email sent with Message ID:', messageId);

            // Not using this as it will require paid api
            // await getDeliveryInfo(messageId);

            const timestamp = new Date().toISOString();
            await writer.writeRecords([{ messageId, timestamp, email: toEmail, statusCode }]);

        }

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const readExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(sheet);
    return excelData;
};

const getDeliveryInfo = async (messageId) => {
    try {
        sgMail.setClient(sgClient);
        const request = sgClient.createRequest({
            url: `/v3/messages/${messageId}`,
            method: 'GET',
        })
        //will need a paid version to view event tracking.
        const response = await sgClient.request(request);
        console.log('Delivery Information:', response.response);
    } catch (error) {
        console.error('Error retrieving delivery information:', error.response.body);
    }
};
