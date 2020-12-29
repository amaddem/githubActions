import { api, LightningElement, wire } from 'lwc';
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {

    @api
    boatTypeId;

    mapMarkers = [];
    isLoading = true;
    isRendered = false;
    latitude;
    longitude;

    @wire(getBoatsByLocation, { boatTypeId: '$boatTypeId', latitude: '$latitude', longitude: '$longitude' })
    wiredBoatsJSON({ error, data }) {
        if (data) {
            this.isLoading = true;
            this.createMapMarkers(JSON.parse(data));
        }
        else if (error) {
            this.dispatchEvent(new ShowToastEvent({ title: ERROR_TITLE, variant: ERROR_VARIANT }));
            this.isLoading = false;
        }

    }
    renderedCallback() {
        if (!this.isRendered) {
            this.getLocationFromBrowser();
        }
        this.isRendered = true; 
    }
    getLocationFromBrowser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.mapMarkers = [{
                    location: {
                        Latitude: this.latitude,
                        Longitude: this.longitude
                    },
                    title: LABEL_YOU_ARE_HERE,
                    icon: ICON_STANDARD_USER
                }]
                this.isRendered = true;
            });
        }
    }

    // Creates the map markers
    createMapMarkers(boatData) {
        const newMarkers = boatData.map(boat => {
            return {
                location: {
                    Longitude: boat.Geolocation__Longitude__s,
                    Latitude: boat.Geolocation__Latitude__s
                },
                title: boat.Name,
            };

        });
        console.log(JSON.stringify(newMarkers));
        newMarkers.unshift({ location: {
                                        Latitude: this.latitude,
                                        Longitude: this.longitude
                                        },
                                    title: LABEL_YOU_ARE_HERE,
                                    icon: ICON_STANDARD_USER
                            });
        this.mapMarkers = newMarkers; 
        this.isLoading = false;
    }
}