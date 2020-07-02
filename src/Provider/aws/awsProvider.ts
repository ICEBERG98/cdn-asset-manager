import AWS from 'aws-sdk';
import fs from 'fs';

// Please Try to instantiate the factory defined in Services/ServiceFactory.ts instead of instantiating the below
// Classes Directly.
class AWSClient implements providerActions {
    args: providerArgs;
    region: string;
    private client: AWS.S3;

    constructor(args: providerArgs, region: string) {
        this.args = args;
        this.region = region;
        this.createClient();
    }

    uploadFile = (filePath: string) => {
        // Recursively Traverse a directory and upload files.
        const stats = fs.statSync(this.args.filePath);
        if (stats.isDirectory()) {
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    console.log(err)
                    throw err;
                }
                files.forEach(
                    (file) => {
                        this.uploadFile(file)
                    }
                )
            })
        } else {
            this.client.upload({
                Bucket: this.args.bucketName,
                Key: filePath,
                Body: fs.createReadStream(filePath)
            })
        }
    }

    upload = () => {
        this.uploadFile(this.args.filePath)
    }

    createClient = () => {
        AWS.config.update({
            region: this.region,
            apiVersion: "2006-03-01",
            credentials: {
                // @ts-ignore
                accessKeyId: this.args.credentials.id,
                // @ts-ignore
                secretKey: this.args.credentials.key
            }
        })
        this.client = new AWS.S3();
    }
}