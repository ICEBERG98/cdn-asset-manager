interface credentials {
    // This can Contain-
    id?: string;
    key: string;
}

interface providerArgs {
    name: string;
    filePath: string;
    bucketName: string;
    credentials?: credentials;
}

interface providerActions {
    args: providerArgs;

    upload(): void;
}

