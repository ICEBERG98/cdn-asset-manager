import {AWSProvider, AWSCredentials} from "../awsProvider";
import AWS from "aws-sdk";


// Factory Class to Implement Clients for Various Services
// Currently I've tried only s3, Will try to make more in the future.
// Also, Various Services Should be put into separate concrete classes
// So that we can abstract away the generation from the Factory.

class AWSServiceFactory extends AWSProvider {
    constructor(region: string, apiVersion: string, credentials: AWSCredentials) {
        super(region, apiVersion, credentials);
        this.setConfig()
        this.authenticate()
    }

    // The Client Factory
    getServiceClient = (serviceName: string) => {
        return new AWS.S3({
            region: super.region,
            apiVersion: super.apiVersion,
        })
    }
}