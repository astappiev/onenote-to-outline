import "dotenv/config";
import got from "got";
import {FormData} from 'formdata-node';

const {OUTLINE_BASE, OUTLINE_API_KEY} = process.env;

const options = {
    prefixUrl: OUTLINE_BASE,
    headers: {
        Authorization: `Bearer ${OUTLINE_API_KEY}`,
    },
};

const client = got.extend(options);

export async function fetchCollections() {
    return await client.post("api/collections.list").json();
}

export async function createCollections(name) {
    return await client.post("api/collections.create", {
        json: {
            name,
            permission: "read_write",
        },
    }).json();
}

export async function fetchDocuments(collectionId) {
    return await client.post("api/documents.list", {
        json: {
            collectionId: collectionId,
            limit: 100,
        },
    }).json();
}

export async function createDocument(collectionId, fileName, fileContent) {
    const form = new FormData();
    form.set('collectionId', collectionId);
    form.set('publish', true);
    form.set('file', new Blob([fileContent], {type: 'text/html'}), fileName + ".html");

    return await client.post("api/documents.import", {
        body: form,
    }).json();
}
