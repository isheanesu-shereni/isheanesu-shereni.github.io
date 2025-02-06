<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Earth Engine Rainfall Data</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/earthengine-api"></script>
    <style>
        #map { height: 500px; width: 100%; }
        #button { position: absolute; top: 10px; left: 10px; padding: 10px; background: #007bff; color: white; }
    </style>
</head>
<body>
    <button id="button">Get Rainfall Data</button>
    <div id="map"></div>

    <script>
        // Initialize the map
        var map = L.map('map').setView([37.7749, -122.4194], 10); // Example location (San Francisco)

        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Function to handle the button click and trigger Earth Engine task
        document.getElementById('button').onclick = function() {
            // Trigger the GEE data extraction
            getRainfallData();
        };

        function getRainfallData() {
            // Authenticate and initialize Earth Engine
            ee.Initialize();

            // Define Area of Interest (AOI)
            var aoi = ee.Geometry.Polygon([
                [[-122.5, 37.7], [-122.5, 37.8], [-122.4, 37.8], [-122.4, 37.7]]
            ]);

            // Fetch the rainfall data (e.g., CHIRPS data)
            var dataset = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
                .filterBounds(aoi)
                .sort('system:time_start', false)
                .limit(1);

            var rainfallImage = dataset.first();

            // Optionally, classify or manipulate the image here if needed
            var rainfallVis = {
                min: 0.0,
                max: 300.0,
                palette: ['blue', 'green', 'yellow', 'red']
            };

            // Add the rainfall data to the map
            var rainfallLayer = ee.Image(rainfallImage).visualize(rainfallVis);

            // Convert the Earth Engine image to a Leaflet-friendly format
            var rainfallLayerUrl = rainfallLayer.getMap().urlFormat;
            var rainfallLayer = L.imageOverlay(rainfallLayerUrl, aoi.getBounds()).addTo(map);
        }
    </script>
</body>
</html>
