import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as maptilersdk from '@maptiler/sdk';

document.addEventListener('DOMContentLoaded', () => {
    const mapEl = document.getElementById('map');
    const maptilerApiKey = window.maptilerApiKey;
    const campgrounds = window.campgrounds;

    if (!mapEl) {
        return;
    }

    if (!maptilerApiKey || maptilerApiKey.trim().length === 0) {
        mapEl.innerHTML = '<div style="padding:20px; color:#b91c1c; font-weight:600;">Map error: MapTiler API key missing.</div>';
        return;
    }

    const validFeatures = Array.isArray(campgrounds?.features)
        ? campgrounds.features.filter((feature) => {
            const coordinates = feature?.geometry?.coordinates;
            return Array.isArray(coordinates) && coordinates.length === 2 && coordinates.every((value) => !Number.isNaN(Number(value)));
        })
        : [];

    maptilersdk.config.apiKey = maptilerApiKey.trim();

    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.BRIGHT,
        center: [80.2090, 25.6139],
        zoom: 4,
    });

    map.on('load', function () {
        map.addSource('campgrounds', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: validFeatures
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#00BCD4',
                    10,
                    '#2196F3',
                    30,
                    '#3F51B5'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    15,
                    10,
                    20,
                    30,
                    25
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['Noto Sans Regular'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'campgrounds',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        map.on('click', 'clusters', async (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            if (!features.length) {
                return;
            }

            const clusterId = features[0].properties.cluster_id;
            const zoom = await map.getSource('campgrounds').getClusterExpansionZoom(clusterId);

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom
            });
        });

        map.on('click', 'unclustered-point', function (e) {
            const feature = e.features?.[0];
            if (!feature) {
                return;
            }

            const popUpMarkup = feature.properties?.popUpMarkup || '<strong>Campground</strong>';
            const coordinates = feature.geometry.coordinates.slice();

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new maptilersdk.Popup()
                .setLngLat(coordinates)
                .setHTML(popUpMarkup)
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
    });
});
