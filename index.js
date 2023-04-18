const isUrl = require("is-url");
const axios = require("axios");
const musicMeta = require("music-metadata");
const camelCase = require("lodash.camelcase");
const toType = require("string-to-datatype");
const fs = require("fs");
const { ms_to_time, calc_duration } = require("./lib/utils");

async function meta(fileOrURL) {
  try {
    let fileMeta;
    if (isUrl(fileOrURL)) {
      fileMeta = await fromUrl(fileOrURL);
    } else {
      if (fs.existsSync(fileOrURL)) {
        let stat = fs.statSync(fileOrURL);
        let resp = await musicMeta.parseFile(fileOrURL);
        fileMeta = { file: fileOrURL, ...(resp.format || {}), ...{ size: stat.size, stat } };
      } else {
        throw new Error(`The file ${fileOrURL} does not exist!`);
      }
    }

    return calc_duration(fileMeta);
  } catch (error) {
    throw error;
  }
}

function fromUrl(url) {
  return new Promise(async (resolve, reject) => {
    // ensure url
    if (isUrl(url) === false) {
      throw new Error(`${url} is not a valid url`);
    }

    const controller = new AbortController();

    // we use streaming to avoid loading whole file
    const response = await axios.get(url, {
      responseType: "stream",
      signal: controller.signal,
      headers: {
        // read minimum amount of data
        Range: "bytes=0-4000",
      },
    });

    const stream = response.data;
    // size = stream.headers['content-length'];

    let buffer,
      headers = {};
    let maxRead = 1048576;

    const abort = () => {
      // abort request
      controller.abort();
      // destroy stream
      stream.destroy();
    };

    const resolveData = (request, format = {}) => {
      resolve({
        request,
        file: url,
        size: headers.contentLength || null,
        ...format,
      });
    };

    stream.on("data", async (data) => {
      if (Object.keys(headers).length === 0) {
        headers = {};
        for (let k in stream.headers) {
          headers[camelCase(k)] = toType(stream.headers[k]);
        }
      }

      buffer = buffer || Buffer.from("");
      buffer = Buffer.concat([buffer, data]);

      // if we have read so much
      // or file is not audio
      if (maxRead < buffer.byteLength || headers.contentType.indexOf("audio/") == -1) {
        // abort
        abort();

        return resolveData(headers);
      }

      try {
        // read enough data to allow parsing

        let format = {};

        // parse xing headers for metadata
        let resp = await musicMeta.parseBuffer(data, headers.contentType);

        format = resp.format;
        const meta = Object.assign(
          { request: { url, headers }, size: headers.contentLength || null },
          format
        );

        // we only need the headers
        // abort
        abort();

        return resolveData(headers, meta);
      } catch (error) {
        console.error(error.message);
        // console.error(error.message);
      }
    });

    stream.on("end", (data) => {
      // if we got here without parsing buffer
      return resolveData(headers);
    });

    stream.on("error", (data) => {
      let err = data.toString();
      // of cause we are cancelling request so ignore the 'CanceledError: canceled' error
      if (err.indexOf("CanceledError") > -1) return;
      reject(err);
    });
  });
}

module.exports = { meta, fromUrl };
