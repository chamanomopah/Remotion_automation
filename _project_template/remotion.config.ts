import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Performance settings for long videos
Config.setChromiumOpenGlRenderer('egl');
Config.setChromiumDisableWebSecurity(true);
Config.setChromiumHeadlessMode(true);

// Export settings
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');

// Browser settings for better performance
Config.setBrowserExecutable(null);
Config.setEnforceAudioTrack(false);

export default {
  codec: 'h264',
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 32400, // 18 minutes at 30fps
  everyNthFrame: 1,
  numberOfGifLoops: null,
  allowAmendment: false,
  dumpBrowserLogs: false,
  envVariables: {},
  chromiumFlags: ['--disable-gpu', '--disable-software-rasterizer'],
  muted: false,
  audioBitrate: '128k',
  videoBitrate: '20M',
};