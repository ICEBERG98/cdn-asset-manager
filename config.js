export const config = { // Configurations for cdn-asset-manager
    AWS: {  // Configuration with Regards to AWS
        Bucket: '', // The AWS Bucket name to which the resources need to be uploaded
        apiVersion: '', // AWS api Version to User
        region: '' // The AWS Region to Connect to
    },
    caFile: '', // The CA file used to auth and verify with Consul to get Vault KV Url
    jenkinsConsulUrl: '', // The Url for Jenkins where the vault token is stored.
    vaultSecretUrl: '' // The Url for the Token where AWS credentials are stored.
};

module.exports = config;