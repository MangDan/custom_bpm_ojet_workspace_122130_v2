let obpmConfig;
// bug: config 정보를 로딩 완료 후 사용해야 함, 정보가 없어서 appController에서 json parsing 오류 발생.
define(['json!/resources/bpmconfig.json'],
  function (config) {
    obpmConfig = config;
});