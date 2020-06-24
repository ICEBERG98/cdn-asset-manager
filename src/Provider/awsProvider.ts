import AWS from 'aws-sdk';


class AWSCredentials implements credentialsInterface {
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

class AWSProvider implements providerInterface {
    set credentials(value: AWSCredentials) {
        this._credentials = value;
    }
    name = 'AWS';
    private _credentials = new AWSCredentials();
    region = '';
    apiVersion = '';

    constructor(params) {
        let properties = ['region', 'apiVersion', 'credentials']
        // Property Existence Checks
        properties.forEach((property) =>{
            if (!property.hasOwnProperty(property)){
                let err = new Error('Missing required property- '+property);
                console.error(err);
                throw err;
            }
        });
        properties.forEach((property) =>{

        })
        this.region = params.region
        this.apiVersion = params.apiVersion
        this
    }



}