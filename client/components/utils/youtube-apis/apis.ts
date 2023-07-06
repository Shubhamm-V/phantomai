import axios from 'axios';
import openNotification from '@/components/utils/Notification';

export const getVideoID = (url: string) => {
  var videoid = url.match(
    /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
  );
  if (videoid != null) {
    return videoid[1];
  } else {
    openNotification({
      type: 'info',
      message: 'Invalid URL',
    });
  }
};

export const getVideoSubtitles = async (url: string) => {
  const videoId = getVideoID(url);
  const options = {
    method: 'GET',
    url: process.env.SUBTITLE_API,
    params: {
      video_id: videoId,
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.SUBTITLE_HOST,
    },
  };
  const subtitles = (await axios(options)).data;
  return subtitles;
};

export const getSummary = async (text: string) => {
  const options = {
    method: 'POST',
    url: process.env.SUMMARY_API,
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.SUMMARY_HOST,
    },
    data: {
      input: text,
    },
  };
  const response = (await axios.request(options)).data.output[0].text;
  return response;
};

export const getTranslation = async (
  text: string,
  from: string,
  to: string
) => {
  const options = {
    method: 'POST',
    url: process.env.TRANSLATE_API,
    headers: {
      'Content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.TRANSLATE_HOST,
    },
    data: {
      from,
      to,
      q: text,
    },
  };
  const response = await (await axios.request(options)).data[0];
  return response;
};

export const getTexttoVoice = async (language: string, text: string) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('src', text);
  encodedParams.set('hl', language);
  encodedParams.set('r', '0');
  encodedParams.set('b64', 'true');
  encodedParams.set('f', '8khz_8bit_mono');
  const options = {
    method: 'POST',
    url: process.env.TEXT_TO_SPEECH_API,
    params: {
      key: process.env.TEXT_TO_SPEECH_KEY,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.TEXT_TO_SPEECH_HOST,
    },
    data: encodedParams,
  };
  const response = await axios.request(options);
  return response.data;
};
