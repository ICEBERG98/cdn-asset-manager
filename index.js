/*
 * Description: Integrates with webpack and uploads assets to cdn.
 * Author: Navin Sadanandan
 */

function CdnUpload(build_opts_raw) {
    let build_opts = JSON.parse(build_opts_raw);
    const config = require('./config')
    const fs = require('fs');
    const request = require('request');
    const AWS = require('aws-sdk');
    const caFile = config.caFile;

    const readFile = (filename, uploadItem, s3client) => {
        let uploadParams = {
            Bucket: config.AWS.bucket,
            Key: '',
            Body: ''
        };
        const source = fs.createReadStream(filename);
        source.on('error', err => {
            console.log('Error while reading file- ', err)
        });
        uploadParams.Body = source;
        let path = require('path');
        uploadParams.Key = path.basename(filename);
        s3client.upload(uploadParams, (err, data) => {
            if (err) {
                console.log("Error while uploading file ", uploadParams.Key);
                console.log(err);
            }
            if (data) {
                console.log("Successfully Uploaded file- ", uploadParams.Key);
            }
        })
        console.log(`Uploading ${uploadItem}`);
    };


    const readDirectory = (directoryName, s3client) => {
        fs.readdir(directoryName, (err, files) => {
            for (const file of files) {
                const stats = fs.statSync(`${directoryName}/${file}`);
                if (stats.isDirectory()) {
                    readDirectory(`${directoryName}/${file}`, s3client);
                } else {
                    readFile(`${directoryName}/${file}`, file, s3client)
                }
            }
        });
    };

    // Get CA file based on buildenvironment
    const GetCAFile = (function (build_opts_raw) {
        GetBuildEnvironment
            .then(() => {
                console.log(`Getting CA File ${caFile}`);
                fs.readdir(build_opts.build_dir, (err, items) => {
                    const consulOptions = Object.freeze({
                        url: config.jenkinsConsulUrl,
                        ca: fs.readFileSync(caFile),
                    });
                    request.get(consulOptions, (consulError, consulResponse, consulBody) => {
                        if (consulError) {
                            throw (consulError);
                        }
                        if (consulResponse.statusCode !== 200 && consulResponse.statusCode !== 302) {
                            throw (consulResponse.statusCode);
                        }
                        const consulRespJson = JSON.parse(consulBody);
                        const b64token = consulRespJson[0].Value;
                        const vaultToken = (Buffer.from(b64token, 'base64').toString('ascii'));
                        const vaultOptions = {
                            url: config.vaultSecretUrl,
                            ca: fs.readFileSync(caFile),
                            headers: {'X-Vault-Token': vaultToken},
                        };
                        request.get(vaultOptions, (vaultError, vaultResponse, vaultBody) => {
                            if (vaultError) {
                                throw (vaultError);
                            }
                            if (vaultResponse.statusCode !== 200 && vaultResponse.statusCode !== 302) {
                                throw (vaultResponse.statusCode);
                            }
                            const vaultdata = JSON.parse(vaultBody);
                            const awscreds = vaultdata.data;
                            console.log('got AWS credentials');
                            const s3client = new AWS.S3({
                                apiVersion: config.AWS.apiVersion,
                                region: config.AWS.region,
                                credentials: {
                                    accessKeyId: awscreds.AccessKeyId,
                                    secretAccessKey: awscreds.SecretAccessKey
                                }
                            })
                            console.log('starting upload of assets');
                            for (const item of items) {
                                const directoryPath = build_opts.build_dir + item;
                                const stats = fs.statSync(directoryPath);
                                stats.isDirectory() ? readDirectory(directoryPath, s3client) : readFile(directoryPath, item, s3client);
                            }
                        });
                    });
                });
            })
            .catch((error) => {
                throw error;
            });
    }());
}

// // Instructions for use:
// var build_opts = {
//   "build_env": "dev",
//   "build_dir": "test_assets/",
//   "build_number": "test-build",
//   "container_name": "cdn-test"
// };
//
// build_opts = JSON.stringify(build_opts);
// CdnUpload(build_opts);
module.exports = CdnUpload;
