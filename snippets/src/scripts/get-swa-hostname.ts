// This step will generate hostname from pattern: <swa-default-hostname>-<swa-environment>.<region>.<swa-base-url>
// salmon-pebble-0100c4100-preview.eastasia.4.azurestaticapps.net
// 
// Because we cannot get the hostname before the environment is created, we need to set the hostname in the config.toml file
// so, this command will not work: `az staticwebapp environment show -n ${{ env.SWA_NAME }} --environment-name ${{ steps.swa-environment.outputs.name }} --query "hostname" -o tsv`

import { $ } from 'bun';
import * as core from '@actions/core';

const swaEnvironment = process.env.SWA_ENVIRONMENT;
const swaName = process.env.SWA_NAME;
console.log('swaName:', swaName);
console.log('swaEnvironment:', swaEnvironment);

const response = await $`az staticwebapp environment show -n ${swaName}`.text();

const environment = JSON.parse(response) as unknown;
if (typeof environment !== 'object') throw new Error('Failed to parse environment, expected object');
if(!environment) throw new Error('Failed to parse environment, expected object');
if(!('hostname' in environment)) throw new Error('Failed to parse environment, expected object with `hostname` property');
if(!('location' in environment)) throw new Error('Failed to parse environment, expected object with `location` property');
// The hostname will look like salmon-pebble-0100c4100.4.azurestaticapps.net`
const hostname = String(environment.hostname);
const location = String(environment.location).replaceAll(' ', '').toLowerCase();

const splitHostname = hostname.split('.');
// the first part of the hostname, e.g. `salmon-pebble-0100c4100`
const defaultHostnamePart = splitHostname[0];
// the rest of the hostname, e.g. `4.azurestaticapps.net`
const restHostnamePart = splitHostname.slice(1).join('.');

// Final hostname will look like salmon-pebble-0100c4100-preview.eastasia.4.azurestaticapps.net
const finalHostname = `${defaultHostnamePart}-${swaEnvironment}.${location}.${restHostnamePart}`;

console.log('hostname:', finalHostname);

core.setOutput('hostname', finalHostname);