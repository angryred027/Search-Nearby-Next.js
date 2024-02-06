export interface Nearby {
    name: string
    address: string,
    position: GeolocationPosition
}

export const nearbyRestaurants = [
    {
        name: "DMK Burger Bar",
        address: "2954 N Sheffield Ave, Chicago, IL 60657",
        position: { 
            coords: {
                latitude: 41.93618511174448,
                longitude: -87.65412423165401,
            }
        }
    },
    {
        name: "Proxi",
        address: "565 W Randolph St, Chicago, IL 60661",
        position: {
            coords: {
                latitude: 41.88445953467612,
                longitude: -87.64254474699867,
            }
        }
    },
    {
        name: "Kumiko",
        address: "630 W Lake St, Chicago, IL 60661",
        position: {
            coords: {
                latitude: 41.88602625623118,
                longitude: -87.64407434699858,
            }
        }
    },
    {
        name: "Gaijin",
        address: "950 W Lake St, Chicago, IL 60661",
        position: {
            coords: {
                latitude: 41.885843856618656,
                longitude: -87.6518450335057,
            }
        }
    },
    {
        name: "S.K.Y.",
        address: "1239 W 18th St, Chicago, IL 60608",
        position: {
            coords: {
                latitude: 41.85792964332049,
                longitude: -87.65775654514977,
            }
        }
    },
    {
        name: "The Purple Pig",
        address: "444 Michigan Ave, Chicago, IL 60605",
        position: {
            coords: {
                latitude: 41.89091460545635,
                longitude: -87.62453693137024,
            }
        }
    },
    {
        name: "The Publican",
        address: "837 W Fulton Market, Chicago, IL 60607",
        position: {
            coords: {
                latitude: 41.88680260364329,
                longitude: -87.64890344699857,
            }
        }
    },
    {
        name: "Monteverde",
        address: "1020 W Madison St, Chicago, IL 60607",
        position: {
            coords: {
                latitude: 41.88245490742205,
                longitude: -87.65315248181305,
            }
        }
    },
    {
        name: "Roister",
        address: "951 W Fulton Market, Chicago, IL 60607",
        position: {
            coords: {
                latitude: 41.88667194213931,
                longitude: -87.65187858932721
            }
        }
    },
] as Nearby[]

