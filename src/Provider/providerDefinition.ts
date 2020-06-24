interface credentialsInterface {
    authFactorPrimary: string,
    secret: string,
    otherAuthFactors?: Object
}

interface providerInterface {
    name: string,
    url?: string,
    region: string,
    apiVersion?: string, // can be cast into number if required by a Provider
    credentials: credentialsInterface
    ProviderSpecific?: Object
}


