/* GET Invoices API
Bulk Invoices Endpoint: https://mtls.authncdr-test.energyaustralia.com.au/cds-au/v1/energy/accounts/invoices
Invoice For Energy Account Endpoint: https://mtls.authncdr-test.energyaustralia.com.au/cds-au/v1/energy/accounts/{{accountId}}/invoices
Invoice For Specific Energy Account Endpoint: https://mtls.authncdr-test.energyaustralia.com.au/cds-au/v1/energy/accounts/invoices
Invoice For Energy Account and Specific Energy Account Relies on Bulk Invoices API for generating the account ID*/

import * as globals from '@jest/globals';
import log from 'ololog';

import * as InvoicesHelper from '../../../src/api-helpers/invoices-api-helpers';
import * as tokenGenerator from '../../../src/api-helpers/tokenGeneration-api-helpers';
import * as header from '../../../src/constants/header-files';
import * as queryParams from '../../../src/constants/queryParams-files';
import * as payLoad from '../../../src/constants/requestBody';

globals.describe('CAT SDH R3 - Invoices APIs Test Suite', () => {
  let bearerTokens: string[][] = [];
  const bearerTokensTitle: string[] = ['Secondary Users Open Accounts'];
  globals.beforeAll(async () => {
    bearerTokens = await Promise.all([await tokenGenerator.SDHTokenGen()]);
  });
  globals.test(
    'CAT SDH R3 - GET Invoices API (Bulk, GET, POST) Test Run 200, 404 & 422 Status Codes Test Run',
    async () => {
      log.bgYellow('CAT SDH GET Invoices API NONE Reads Test Run');
      for (let i = 0; i < bearerTokens.length; i++) {
        log.bgRed(`++++++++++ ${bearerTokensTitle[i]} +++++++++`);
        for (let j = 0; j < bearerTokens[i].length; j++) {
          header.headers.Authorization = `Bearer ${bearerTokens[i][j]}`;
          const bulkInvoicesResponse = await InvoicesHelper.getBulkInvoices(header.headers);
          log.blue('Bulk Invoices Response : ' + JSON.stringify(bulkInvoicesResponse.body));
          log.green('Bulk Invoices Status Code : ' + bulkInvoicesResponse.statusCode);
          const invoices = bulkInvoicesResponse.body.data.invoices;
          if (invoices.length !== 0) {
            for (let k = 0; k < invoices.length; k++) {
              if (invoices.length > 1) {
                const InvoiceForEnergyAccountResponse = await InvoicesHelper.getInvoicesForAccount(
                  header.headers,
                  invoices[k].accountId,
                );
                log.red(
                  'Invoices For Energy Account Response : ' + JSON.stringify(InvoiceForEnergyAccountResponse.body),
                );
                log.green('Invoices For Energy Account Status Code : ' + InvoiceForEnergyAccountResponse.statusCode);
                const requestBody: payLoad.requestBody_accounts = {
                  data: { accountIds: [invoices[k].accountId] },
                };
                header.headers.Authorization = `Bearer ${bearerTokens[i][j]}`;
                const InvoiceForSpecificEnergyAccountResponse = await InvoicesHelper.getInvoicesForSpecificAccounts(
                  { ...requestBody },
                  header.headers,
                );
                log.magenta(
                  'Invoices For Specific Energy Account Response : ' +
                    JSON.stringify(InvoiceForSpecificEnergyAccountResponse.body),
                );
                log.green(
                  'Invoices For Specific Energy Account Status Code : ' +
                    InvoiceForSpecificEnergyAccountResponse.statusCode,
                );
                break;
              }
            }
          } else if (invoices.length === 0) {
            log.red('No Non Open Accounts Available for Secondary Users');
          }
        }
      }
    },
  );
  globals.test(
    'CAT SDH R3 - GET Invoices API (Bulk, GET, POST) 2 Years Oldest-Date Test Run 200, 404 & 422 Status Codes Test Run',
    async () => {
      log.bgYellow('CAT SDH GET Invoices API With 2 years Oldest Date Reads Test Run');
      for (let i = 0; i < bearerTokens.length; i++) {
        log.bgRed(`++++++++++ ${bearerTokensTitle[i]} +++++++++`);
        for (let j = 0; j < bearerTokens[i].length; j++) {
          header.headers.Authorization = `Bearer ${bearerTokens[i][j]}`;
          const bulkInvoicesResponse = await InvoicesHelper.getBulkInvoices(header.headers, queryParams.date_reads);
          log.blue('Bulk Invoices 2 Years Oldest Date Response : ' + JSON.stringify(bulkInvoicesResponse.body));
          log.green('Bulk Invoices 2 Years Oldest Date Status Code : ' + bulkInvoicesResponse.statusCode);
          const invoices = bulkInvoicesResponse.body.data.invoices;
          if (invoices.length !== 0) {
            for (let k = 0; k < invoices.length; k++) {
              if (invoices.length > 1) {
                const InvoiceForEnergyAccountResponse = await InvoicesHelper.getInvoicesForAccount(
                  header.headers,
                  invoices[0].accountId,
                  queryParams.date_reads,
                );
                log.red(
                  'Invoices For Energy Account 2 Years Oldest Date Response : ' +
                    JSON.stringify(InvoiceForEnergyAccountResponse.body),
                );
                log.green(
                  'Invoices For Energy Account 2 Years Oldest Date Status Code : ' +
                    InvoiceForEnergyAccountResponse.statusCode,
                );
                const requestBody: payLoad.requestBody_accounts = {
                  data: { accountIds: [invoices[0].accountId] },
                };
                header.headers.Authorization = `Bearer ${bearerTokens[i][j]}`;
                const InvoiceForSpecificEnergyAccountResponse = await InvoicesHelper.getInvoicesForSpecificAccounts(
                  { ...requestBody },
                  header.headers,
                  queryParams.date_reads,
                );
                log.magenta(
                  'Invoices For Specific Energy Account 2 Years Oldest Date Response : ' +
                    JSON.stringify(InvoiceForSpecificEnergyAccountResponse.body),
                );
                log.green(
                  'Invoices For Specific Energy Account 2 Years Oldest Date Status Code : ' +
                    InvoiceForSpecificEnergyAccountResponse.statusCode,
                );
                break;
              }
            }
          } else if (invoices.length === 0) {
            log.red('No Non Open Accounts Available for Secondary Users');
          }
        }
      }
    },
  );
});
