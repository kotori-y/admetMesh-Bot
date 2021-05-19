/*
 * @Description: post admetMesh (https://admetmesh.scbdd.com/)
 * @Author: Kotori Y
 * @Date: 2021-05-18 14:03:30
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-05-19 09:33:06
 * @FilePath: \admetMesh-bot\scripts\index.js
 * @AuthorMail: kotori@cbdd.me
 */

const fetch = require("node-fetch");
const cheerio = require("cheerio");
const FormData = require("form-data");
const load = require("./load");

async function getTokenCookie() {
  const visitUrl = "https://admetmesh.scbdd.com/service/screening/index";

  var resp = await fetch(visitUrl, {
    method: "GET",
    timeout: 180000,
  });

  var html = await resp.text();
  var $ = cheerio.load(html);
  const token = $("input[name='csrfmiddlewaretoken']").val();
  const cookie = resp.headers.raw()["set-cookie"][0];
  return [token, cookie];
}

async function predict(smiles) {
  const [token, cookie] = await getTokenCookie();
  const postUrl = "https://admetmesh.scbdd.com/service/screening/cal";

  const headers = {
    Origin: "https://admetmesh.scbdd.com",
    Referer: "https://admetmesh.scbdd.com/service/screening/index",
    Cookie: cookie,
  };

  const form = new FormData();
  form.append("csrfmiddlewaretoken", token);
  form.append("smiles-list", smiles);
  form.append("method", "2");
  form.append("X-CSRFTOKEN", token);

  const resp = await fetch(postUrl, {
    method: "POST",
    timeout: 180000000,
    body: form,
    headers: headers,
  });

  html = await resp.text();
  $ = cheerio.load(html);
  const finUrl = $("input[name='file_path']").val();
  return finUrl;
}

async function getRes(smiles) {
  let finUrl = await predict(smiles);
  finUrl = `https://admetmesh.scbdd.com${finUrl}`;

  const resp = await fetch(finUrl, {
    method: "GET",
    timeout: 180000,
  });

  const res = await resp.text();
  return res;
}

(async () => {
  try {
    const smis = await load.loadSmi();
    const res = await getRes(smis);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
})();
