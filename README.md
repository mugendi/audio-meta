<!--
 Copyright (c) 2023 Anthony Mugendi

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# Audio-Meta

Get the metadata of audio files on disk or even as URLS.

For URLS, this module fetches the minimum number of bytes enough to get metadata of the audio and thus remains super fast!

```javascript
// init
const audioMeta = require('audio-meta');

// get meta
const url =
    'https://cdn.pixabay.com/download/audio/2023/04/17/audio_ae4d57086a.mp3?filename=futuristic-beat-146661.mp3';

audioMeta
    .meta(url)
    .then((resp) => {
        console.log(resp);
    })
    .catch(console.error);
```

This will output the following info:

```javascript

{
  request: {
    url: 'https://cdn.pixabay.com/download/audio/2023/04/17/audio_ae4d57086a.mp3?filename=futuristic-beat-146661.mp3',
    headers: {
      date: 2023-04-18T13:05:10.000Z,
      contentType: 'audio/mpeg',
      contentLength: 3883676,
      connection: 'close',
      cfRay: '7b9d1e277c029d03-JNB',
      accessControlAllowOrigin: '*',
      age: 23541,
      cacheControl: +086399-12-31T21:00:00.000Z,
      contentDisposition: 'attachment; filename="futuristic-beat-146661.mp3"',
      etag: '290523affa1536d5bd57f2cd48ab1c8c',
      lastModified: 2023-04-17T09:18:15.000Z,
      cfCacheStatus: 'HIT',
      accessControlAllowMethods: 'GET, HEAD',
      accessControlMaxAge: 86400,
      xAmzReplicationStatus: 'COMPLETED',
      xAmzServerSideEncryption: 'AES256',
      setCookie: [Array],
      vary: 'Accept-Encoding',
      server: 'cloudflare',
      altSvc: 'h3=":443"; ma=86400, h3-29=":443"; ma=86400'
    }
  },
  file: 'https://cdn.pixabay.com/download/audio/2023/04/17/audio_ae4d57086a.mp3?filename=futuristic-beat-146661.mp3',
  size: 3883676,
  tagTypes: [],
  trackInfo: [],
  lossless: false,
  container: 'MPEG',
  codec: 'MPEG 1 Layer 3',
  sampleRate: 44100,
  numberOfChannels: 2,
  bitrate: 256000,
  duration: { durationSecs: 121.364875, pretty: '00:02:01' }
}


```
