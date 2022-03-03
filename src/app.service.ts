import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;900&display=swap" rel="stylesheet">
    <title>Leetcode Contest APIs</title>
    <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-blend-mode: soft-light,screen;
    }
    </style>
    </head>
    <body>
    <h1 style='font-weight: 900'>Leetcode Contest APIs</h2>
    <p> APIs to empower front-end developers to build richer interfaces on top of Leetcode's contest data.</p>
    <p>Want a specific API capability? Open an issue on the repo.</p>
    <p>Like this project? Show your support by adding a star to the Github repo. It'll keep me going 😊!!</p>
    <a href='https://github.com/Nnadozie/leetcode-contest-api'>Github Repo</a>
    <br><br>
    <a href='https://leetcode-contest-api.readme.io/'>API Documentation</a>
    <br><br>
    <a href='https://dozie.dev/building-a-leetcode-contest-percentile-analyser-1'>Motivation</a>
    
    </body>
    </html>`;
  }
}
