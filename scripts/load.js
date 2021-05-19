/*
 * @Description:
 * @Author: Kotori Y
 * @Date: 2021-05-19 08:59:47
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-05-19 09:21:04
 * @FilePath: \admetMesh-bot\scripts\load.js
 * @AuthorMail: kotori@cbdd.me
 */
const fetch = require("node-fetch");

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

async function loadSmi() {
  const url =
    "https://raw.githubusercontent.com/kotori-y/admetMesh-bot/master/data/sample.smi";

  const resp = await fetch(url, {
    method: "GET",
    timeout: 180000,
  });

  let smis = await resp.text();
  smis = smis.split("\n");
  smis = shuffle(smis).join("\r\n");
  // console.log(smis)
  return smis;
}


module.exports = { loadSmi };