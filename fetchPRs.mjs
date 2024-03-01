#!/usr/bin/env zx
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

if (!process.env.GH_TOKEN) {
  process.env.GH_TOKEN = process.env.OP_GH_RW_PACKAGES;
}

async function fetchPRDetails(prNumber, repo) {
  try {
    // Fetch PR details including reviews
    let prDetails = await $`gh pr view ${prNumber} --repo ${repo} --json number,url,reviewDecision,reviews`.quiet();
    return JSON.parse(prDetails.stdout);
  } catch (error) {
    console.error(`Error fetching PR details for PR #${prNumber} in ${repo}:`, error);
    return null; // Return null if there's an error fetching details
  }
}

async function fetchOpenPRsForUsers(repos, users) {
  for (const repo of repos) {
    console.log('\n');
    console.log(chalk.bold(repo));
    console.log('-------------------------');
    try {
      let prsOutput = await $`gh pr list --repo ${repo} --state open --json number,url,author,createdAt`.quiet();
      let prs = JSON.parse(prsOutput.stdout);

      for (const pr of prs.filter((pr) => users.includes(pr.author.login.toLowerCase()))) {
        const prDetails = await fetchPRDetails(pr.number, repo);
        if (!prDetails) continue; // Skip if PR details couldn't be fetched

        let prAgeDays = (new Date() - new Date(pr.createdAt)) / (1000 * 60 * 60 * 24);
        let color = prAgeDays > 2 ? chalk.red : chalk.white;
        let approvalCount = prDetails.reviews.filter((review) => review.state === 'APPROVED').length;

        console.log(
          color(
            `User: ${pr.author.login} - PR: ${pr.url} - Age: ${prAgeDays.toFixed(
              2,
            )} days - Approvals: ${approvalCount} ${prDetails.reviewDecision}`,
          ),
        );
      }
    } catch (error) {
      console.error(`An error occurred for repo ${repo}:`, error);
    }
  }
}

// Load repositories and users from .env file
const repos = process.env.REPOS?.split(',') || [];
const users = process.env.USERS?.split(',') || [];

if (repos.length === 0 || users.length === 0) {
  console.log('Please define REPOS and USERS in the .env file.');
  process.exit(1);
}

await fetchOpenPRsForUsers(repos, users);
console.log('\n');
console.log('\n');
