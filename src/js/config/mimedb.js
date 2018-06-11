let mimedb;
// bug: config 정보를 로딩 완료 후 사용해야 함, 정보가 없어서 appController에서 json parsing 오류 발생.
define(['json!https://cdn.rawgit.com/jshttp/mime-db/master/db.json'],
  function (db) {
    if (!mimedb)
      mimedb = db;
console.log(mimedb);
    //oj.Logger.info("load cdn mimedb");
  }, function (err) {
    require(['json!/resources/mimedb.json'], function (db) {
      if (!mimedb)
        mimedb = db;

      //oj.Logger.info("load local mimedb : " + err);
    });
  });
