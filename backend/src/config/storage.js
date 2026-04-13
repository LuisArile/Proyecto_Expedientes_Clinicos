const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER;

if (!accountName || !accountKey || !containerName) {
  throw new Error("AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCOUNT_KEY y AZURE_STORAGE_CONTAINER deben estar configuradas en el .env");
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

const containerClient = blobServiceClient.getContainerClient(containerName);

module.exports = { containerClient };