async function getDetailOp(li) {
  const args = getArguments(li);
  const html = await getHtml(args);
  const lines = $(html).find('tr').toArray();
  const detail = lines.reduce((data, tr) => {
    const [key, value] = $(tr).find('td').toArray();

    data[$(key).text().trim()] = $(value).text().trim();
    return data;
  }, {});

  return detail;
}

function getArguments(li) {
  const stringArg = $(li).find('a').attr('href');
  const stringArgRE =
    /^javascript:openDetailOpe\((?<numMvt>\d+),'(?<mvtcpt>[^']*)','null',false,'CD'\)$/u;

  if (!stringArgRE.test(stringArg)) throw new Error('unable to find args');
  const [, , mvtcpt] = stringArg.match(stringArgRE);
  const url = `/outil/UWLM/DetailMouvementPar/accesDetailMouvementPar?\
mode=45&NUMMVTCPT=${mvtcpt}&DDNAME=null`;
  // eslint-disable-next-line no-magic-numbers
  const data = { random: Math.floor(Math.random() * 1000000000000000000000) };

  return { data, url };
}

function getHtml({ data, url }) {
  const promise = {};

  promise.promise = new Promise((rs, rj) => {
    promise.resolve = rs;
    promise.reject = rj;
  });

  $.ajax({
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    data,
    dataType: 'html',
    error: promise.reject,
    success: promise.resolve,
    type: 'POST',
    url,
  });

  return promise.promise;
}
