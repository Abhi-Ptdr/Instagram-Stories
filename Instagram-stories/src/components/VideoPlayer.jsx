import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';
import 'shaka-player/dist/controls.css'; // Still import CSS for any UI elements if needed

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const adContainerRef = useRef(null); // New ref for manual ad container
//   const vastUrl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
  const vastUrl = 'https://fantasticcommunity.com/dfm.FBzkdBG/NKvFZXGkUq/XeXm/9cudZIUflikZP/TBYP3/M/jNMN3WN/zNIbt/NejCcLyQM-zBc/3GMNy/ZqsaawW/1IpRdMDm0Oxq';
  const videoManifestUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'; // Replace with a real manifest URL

  // IMA SDK library designed to handle any VAST-compliant ad tags
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

    let player;
    let ui;

    const init = async () => {
      await loadImaSdk();

      const video = videoRef.current;
      const container = containerRef.current;

      // Create Player without media element
      player = new shaka.Player();
      // Attach to video element (required now)
      await player.attach(video);

      // Optional: If you want Shaka UI controls, initialize Overlay
      // (This works if shaka.ui is available in your build)
      if (shaka.ui && shaka.ui.Overlay) {
        ui = new shaka.ui.Overlay(player, container, video);
      }

      player.addEventListener('error', (event) => {
        console.error('Shaka Player error:', event.detail);
      });

      // Manual ad container div (required for client-side ads without full UI dependency issues)
      const adContainer = document.createElement('div');
      adContainer.style.position = 'absolute';
      adContainer.style.top = '0';
      adContainer.style.left = '0';
      adContainer.style.width = '100%';
      adContainer.style.height = '100%';
      adContainer.style.pointerEvents = 'none'; // Allow clicks to pass through to video
      container.appendChild(adContainer);
      adContainerRef.current = adContainer;

      const adManager = player.getAdManager();

      // Initialize client-side ads with manual container
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

      // Optional ad event listeners
      adManager.addEventListener(google.ima.AdEvent.Type.STARTED, () => console.log('Ad started'));
      adManager.addEventListener(google.ima.AdEvent.Type.COMPLETED, () => console.log('Ad completed'));
      adManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e) => console.error('Ad error:', e));

      // Load content (ads will play as pre-roll if specified in VAST)
      await player.load(videoManifestUrl);
      console.log('Video loaded');
      video.play();
    };

    init().catch((error) => {
      console.error('Init failed:', error);
    });

    // Cleanup
    return () => {
      if (player) player.destroy();
      if (adContainerRef.current?.parentNode) {
        adContainerRef.current.parentNode.removeChild(adContainerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative'}} >
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%' }}
        controls
        autoPlay
      />
    </div>
  );
};

export default VideoPlayer;