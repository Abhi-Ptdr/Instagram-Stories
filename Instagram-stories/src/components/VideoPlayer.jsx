import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player/dist/shaka-player.ui.js'; // <-- UI bundle
import 'shaka-player/dist/controls.css'; // UI styles

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // HillTopAds VAST URL
  // const vastUrl = 'https://fantasticcommunity.com/dFmiFBz/d.GnNZviZxGfUJ/ie/mU9EuGZcUjlUkwPYTFY-3uM/jIMv3LNXzmIJtONSjdc/yzMGz/cE3rM/yIZYs/aSWd1fp/dFDb0rxz';
  
  // Google Sample VAST URL
  const vastUrl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&correlator=';
  
  const videoManifestUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

  // IMA SDK supports requesting ads from any VAST-compliant ad server. It Handles ad playback. IMA can parse VAST XML and render ad regardless of the source.
  const loadImaSdk = () => {
    return new Promise((resolve, reject) => {
      if (window.google?.ima) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported!');
      return;
    }

    let player = null;
    let ui = null;

    const init = async () => {
      try {
        await loadImaSdk();

        const video = videoRef.current;
        const container = containerRef.current;

        // Create player WITHOUT media element (new recommended way)
        player = new shaka.Player();
        await player.attach(video);

        // Initialize Shaka UI Overlay — this handles ad container correctly
        ui = new shaka.ui.Overlay(player, container, video);

        const controls = ui.getControls();
        const adManager = player.getAdManager();

        // Shaka UI creates its own client-side ad container automatically
        const adContainer = controls.getClientSideAdContainer();

        const adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

        adManager.initClientSide(adContainer, video, adsRenderingSettings);

        // Request ads
        const adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = vastUrl;
        adsRequest.linearAdSlotWidth = video.clientWidth || 640;
        adsRequest.linearAdSlotHeight = video.clientHeight || 360;
        adsRequest.nonLinearAdSlotWidth = video.clientWidth || 640;
        adsRequest.nonLinearAdSlotHeight = 150;

        adManager.requestClientSideAds(adsRequest);

        // Optional ad event logs
        adManager.addEventListener(google.ima.AdEvent.Type.STARTED, () => console.log('Ad started'));
        adManager.addEventListener(google.ima.AdEvent.Type.COMPLETED, () => console.log('Ad completed'));
        adManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e) => console.error('Ad error:', e));

        // Load content
        await player.load(videoManifestUrl);
        console.log('Video loaded');
        video.play().catch((err) => console.warn('Autoplay prevented:', err));

      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    init();

    // Cleanup
    return () => {
      if (player) player.destroy();
      // ui.destroy() is called automatically by player.destroy() in recent versions
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        background: '#000',
      }}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', height: 'auto' }}
        controls
        autoPlay
        muted // Often required for autoplay
      />
    </div>
  );
};

export default VideoPlayer;