export interface Position {
    latitude: number;
    longitude: number;
    Elevation?: number;
}

export interface Location {
    name: string;
    position?: Position;
}

export type LocationState = Location[];

export let DefaultLocations: LocationState = [
        {name: 'Arbetsrum'},
        {name: 'Datacenter'},
        {name: 'Kök'},
        {name: 'Sovrum'}];
