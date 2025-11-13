// src/showPageMap.js
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as maptilersdk from '@maptiler/sdk';

document.addEventListener('DOMContentLoaded', () => {

  function showMapError(msg) {
    console.error(msg);
    const card = document.getElementById('mapCard') || document.getElementById('map');
    if (card) {
      card.innerHTML = `<div style="padding:20px; color:#b91c1c; font-weight:600;">Map error: ${msg}</div>`;
    }
  }

  try {
    // MapTiler SDK is now imported via ES module
    if (!maptilersdk) {
      showMapError('MapTiler SDK not loaded.');
      return;
    }

    if (!maptilerApiKey || maptilerApiKey.trim().length === 0) {
      showMapError('MapTiler API key missing.');
      return;
    }

    maptilersdk.config.apiKey = maptilerApiKey;

    if (!campground || !campground.geometry || !Array.isArray(campground.geometry.coordinates)) {
      showMapError('campground.geometry.coordinates missing or invalid.');
      console.log('campground:', campground);
      return;
    }

    let coords = campground.geometry.coordinates.map(c => Number(c));
    if (coords.some(Number.isNaN)) {
      showMapError('Coordinates contain non-numeric values: ' + JSON.stringify(campground.geometry.coordinates));
      return;
    }

    const [lng, lat] = coords;
    const mapEl = document.getElementById('map');
    if (!mapEl) {
      showMapError('#map element not found.');
      return;
    }

    const rect = mapEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      mapEl.style.minHeight = '420px';
    }

    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.BRIGHT,
      center: [lng, lat],
      zoom: 10
    });

    new maptilersdk.Marker()
      .setLngLat([lng, lat])
      .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(
        `<strong>${escapeHtml(campground.title || '')}</strong><div>${escapeHtml(campground.location || '')}</div>`
      ))
      .addTo(map);

    setTimeout(() => { try { map.resize(); } catch (e) {} }, 300);

    console.log('Map initialized at', [lng, lat]);

  } catch (err) {
    showMapError('Unhandled error: ' + err.message);
    console.error(err);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

});
