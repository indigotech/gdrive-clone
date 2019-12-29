import chalk from 'chalk';
import * as fs from 'fs';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as readline from 'readline';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

export async function getAuthClient(clientId: string, clientSecret: string): Promise<OAuth2Client> {

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, 'urn:ietf:wg:oauth:2.0:oob');

  let authCredentials: Credentials;

  try {
    let tokenStr = fs.readFileSync(TOKEN_PATH).toString();
    authCredentials = JSON.parse(tokenStr);
  } catch {
    authCredentials = await fetchCredentials(oAuth2Client);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(authCredentials));
  }

  oAuth2Client.setCredentials(authCredentials);

  return oAuth2Client;
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
* @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
*/
async function fetchCredentials(client: OAuth2Client): Promise<Credentials> {
  const authUrl = client.generateAuthUrl({
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:');
  console.log(chalk.underline(authUrl));

  const code = await getCodeFromUser();
  const response = await client.getToken(code);

  return response.tokens;
}

function getCodeFromUser(): Promise<string> {
  let resolve;
  const promise = new Promise<string>(res => resolve = res);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    resolve(code);
  });

  return promise;

}