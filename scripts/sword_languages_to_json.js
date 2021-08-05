const fetchline = require('nodefetchline');
const fs = require('fs');

const SWORD_LANGUAGES_URL = "https://crosswire.org/svn/sword/trunk/locales.d/locales.conf";

parseSwordLocales().then(languages => {
  fs.writeFileSync(`lib/languages.json`, JSON.stringify(languages, null, 2));
});


/**
 * Converts SWORD locales.conf to object/JSON:
 * SWORD locale data:
 *   ...
 *   az-Cyrl=Азәрбајҹан
 *   az=Azərbaycan / Азәрбајҹан / آذربایجان
 *   az-Arab=آذربایجان
 *   az.en=Azerbaijani
 *   az-Latn=Azərbaycan
 *   ...
 * will be converted to
 *   "az": {
 *     "name": "Azərbaycan / Азәрбајҹан / آذربایجان",
 *     "en": "Azerbaijani",
 *     "scripts": {
 *       "Cyrl": {
 *         "name": "Азәрбајҹан"
 *       },
 *       "Arab": {
 *         "name": "آذربایجان"
 *       },
 *       "Latn": {
 *         "name": "Azərbaycan"
 *       }
 *     }
 *   }
 * 
 * @returns {Object} Map of languages by code
 */
async function parseSwordLocales() {
  var languages = {};
  var isTextSection = false;

  const lineIterator = fetchline(SWORD_LANGUAGES_URL);
  for await (const line of lineIterator) {
    if (line.trim() == '[Text]') {
      isTextSection = true;
      continue;
    }
    if (!isTextSection || line[0] == '#' || line.trim() == '') {
      continue;
    }
    
    const data = parseLine(line.trim());
    if(!data) {
      continue;
    }

    languages[data.code] = addDataToMap(languages[data.code] || {}, data.name, data.script, data.locale, data.region);

  }
  return languages;
}

function parseLine(line) {
  const found = line.match(/^(?<code>[a-z0-9]{2,})(?:-(?<script>[a-z]{4}))?(?:-(?<region>[a-z]{2}))?(?:\.(?<locale>[a-z]{2,3}))?=(?<name>.+)$/i);
  if (!found) {
    console.log(`Skipping line: ${line}`);
    return undefined;
  }
  return {
    code: found.groups.code,
    script: found.groups.script,
    region: found.groups.region,
    locale: found.groups.locale,
    name: found.groups.name,
  };
}

function addDataToMap(langObj, name, script=undefined, locale=undefined, region=undefined) {
  var newLangObj;
  const nameObj = locale ? { [locale]: name } : { 'name': name };
  if (script) {
    newLangObj = { 
      ...langObj,
      scripts: { 
        ...langObj.scripts,
        [script]: langObj.scripts ? { ...langObj.scripts[script], ...nameObj } : nameObj 
      } 
    };
  } else if (region) { // region will be skipped if script is present. So far SWORD data has either script or region present
    newLangObj = {
      ...langObj,
      regions: {
        ...langObj.regions,
        [region]: nameObj
      }
    };
  } else {
    newLangObj = {...langObj, ...nameObj};
  }  

  return newLangObj;
}

// export functions for unit testing
module.exports = {
  parseLine,
  addDataToMap,
};