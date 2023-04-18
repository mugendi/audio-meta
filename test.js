/**
 * Copyright (c) 2023 Anthony Mugendi
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const audioMeta = require(".");
const url = "https://cdn.pixabay.com/download/audio/2023/04/17/audio_ae4d57086a.mp3?filename=futuristic-beat-146661.mp3"

audioMeta.meta(url)
    .then((resp)=>{
        console.log(resp)
    })
    .catch(console.error)