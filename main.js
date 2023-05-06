import { jumboScrapper } from "./jumbo-scrapper";

const user = process.argv[2];
const pass = process.argv[3];

jumboScrapper(user, pass)