import AWS from 'aws-sdk';


initS3Client = (AWSConfig) => {
    // Property Check for Region
    if (AWSConfig.hasOwnProperty('Region') === false) {
        let err = new Error('Region is required');
        console.log(err);
        throw err;
    }
    // Property Check for api Version
    if (AWSConfig.hasOwnProperty('apiVersion') === false) {
        let err = new Error('Api version is required');
        console.log(err);
        throw err;
    }
    // Finally updating the properties
    AWS.config.update({
        region: AWSConfig.region,
        apiVersion: AWSConfig.apiVersion
    });
    // Checking if credentials field are provided in AWS Config
    if (AWSConfig.hasOwnProperty('Credentials') === false) {
        let err = new Error('Credentials is required');
        console.log(err);
        throw err;
    }
    // Checking if credentials have Explicitly Speci
    if (AWSConfig.Credentials.hasOwnProperty('accessKeyId') && AWSConfig.Credentials.hasOwnProperty('secretAccessKey')) {
        AWSConfig.update({
            credentials: {
                accessKeyId: AWSConfig.Credentials.accessKeyId,
                secretAccessKey: AWSConfig.Credentials.secretAccessKey
            }
        });
    } else {
        let err = new Error('Either AccessKeyId or Secret Access Key is missing from AWS Config Credentials')
        console.log(err)
        throw err;
    }

}
