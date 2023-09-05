<template>
<div style="width: 100vw;justify-content:center;display: flex;background:transparent;" >
  <GMapAutocomplete
    ref="autocomplete"
    placeholder="Enter street/road name"
    @place_changed="setPlace"
    style="width: 80%; padding:20px;margin:20px;"
  >
</div>
  </GMapAutocomplete>
  <GMapMap
    :center="center"
    :zoom="17"
    map-type-id="terrain"
    style="width: 100vw; height: 100vh"
  >
    <GMapCluster :zoomOnClick="true">
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="onMarkerClick(m)"
        @dragend="onMarkerDragEnd(m, $event)"
      />
    </GMapCluster>
  </GMapMap>
</template>

<script>
import constants from '../constants.js';
export default {
  data() {
    return {
      center: { lat: -26.0168714, lng: 28.0958871 },
      markers: [
        {
          position: {
            lat: -26.0168714,
            lng: 28.0958871,
          },
        },
      ],
    };
  },
  methods: {
    async setPlace() {
      // Get the autocomplete input element
      const input = this.$refs.autocomplete.$refs.input;

      // Get the selected place (user-entered text)
      const place = input.value;

      // Use the Google Maps Geocoding API to convert the place to coordinates
      const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        place
      )}&key=${constants.apiKey}`;

      try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          // Extract the latitude and longitude from the geocoding result
          const location = data.results[0].geometry.location;

          // Update the marker's position
          this.markers[0].position = {
            lat: location.lat,
            lng: location.lng,
          };

          // Update the map's center to the new marker position
          this.center = this.markers[0].position;
        } else {
          console.error('No results found for the entered place.');
        }
      } catch (error) {
        console.error('Error fetching geocoding data:', error);
      }
    },
    onMarkerClick(marker) {
      // Display the marker's position on click
      alert(
        `Marker clicked. Latitude: ${marker.position.lat}, Longitude: ${marker.position.lng}`
      );
    },
    onMarkerDragEnd(marker, event) {
      // Update the marker's position after drag
      marker.position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      // Display the updated position
      alert(
        `Marker dragged. New Latitude: ${marker.position.lat}, New Longitude: ${marker.position.lng}`
      );
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>
