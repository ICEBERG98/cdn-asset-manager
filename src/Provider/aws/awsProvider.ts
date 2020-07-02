import AWS from 'aws-sdk';


// Please Try to instantiate the factory defined in Services/ServiceFactory.ts instead of instantiating the below
// Classes Directly.
export class AWSCredentials implements credentialsInterface {
    constructor(accessKey?: string, secret?: string) {
        if (accessKey) {
            this.authFactorPrimary = accessKey;
        }
        if (secret) {
            this.secret = secret;
        }
    }

    private _authFactorPrimary = ''; // Enter AccessKeyId Here

    set authFactorPrimary(value: string) {
        this._authFactorPrimary = value;
    }

    private _secret = '' // SecretAccessKeyHere

    set secret(value: string) {
        this._secret = value;
    }

    authenticate = () => {
        if (this._authFactorPrimary === '' || this._secret === '') {
            let err = new Error("Either AccessKey or SecretKey is \'\'");
            console.error(err);
            throw err;
        } else {
            AWS.config.update(
                {
                    credentials: {
                        accessKeyId: this._authFactorPrimary,
                        secretAccessKey: this._secret
                    }
                }
            );
        }
    }
}

export class AWSProvider implements providerInterface {
    set credentials(value: AWSCredentials) {
        this._credentials = value;
    }

    name = 'AWS';
    private _credentials = new AWSCredentials();
    region = '';
    apiVersion = '';

    constructor(region: string, apiVersion: string, credentials: AWSCredentials) {
        this.region = region;
        this.apiVersion = apiVersion;
        this.credentials = credentials;
    }

    setConfig = () => {
        AWS.config.update({
            region: this.region,
            apiVersion: this.apiVersion,
        })
    }

    authenticate = () => {
        this._credentials.authenticate()
    }
}