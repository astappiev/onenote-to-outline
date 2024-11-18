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
    return (await client.post("api/collections.list").json()).data;
}

export async function fetchCollectionsAsMap() {
    const collections = await fetchCollections();

    return collections.reduce((map, obj) => {
        map.set(obj.name, obj.id);
        return map;
    }, new Map());
}

export async function createCollections(name) {
    return (await client.post("api/collections.create", {
        json: {
            name,
            permission: "read_write",
        },
    }).json()).data;
}

export async function deleteCollections(collectionId) {
    return client.post("api/collections.delete", {
        json: {
            id: collectionId,
        },
    }).json();
}

export async function convertCollectionToDocument(collectionId, parentDocumentId) {
    const movedDocuments = [];
    const collectionDocs = await fetchDocuments(collectionId);
    for (const doc of collectionDocs) {
        await moveDocument(doc.id, undefined, parentDocumentId);
        console.log("Moved: " + doc.title);
        movedDocuments.push(doc);
    }

    const isEmpty = (await fetchDocuments(collectionId)).length === 0;
    if (isEmpty) {
        await deleteCollections(collectionId);
        console.log("Collection is empty! Deleted: " + collectionId);
    } else {
        throw new Error("Collection is not empty! " + collectionId);
    }

    return movedDocuments;
}

export async function fetchDocuments(collectionId, parentDocumentId = null) {
    return (await client.post("api/documents.list", {
        json: {
            collectionId: collectionId,
            parentDocumentId: parentDocumentId,
            limit: 100,
        },
    }).json()).data;
}

export async function fetchDocumentsAsMap(collectionId, parentDocumentId = undefined) {
    const documents = await fetchDocuments(collectionId, parentDocumentId);

    return documents.reduce((map, obj) => {
        map.set(obj.title, obj.id);
        return map;
    }, new Map());
}

export async function moveDocument(documentId, collectionId, parentDocumentId = undefined) {
    return client.post("api/documents.move", {
        json: {
            id: documentId,
            collectionId: collectionId,
            parentDocumentId: parentDocumentId,
        },
    }).json();
}

export async function createDocument(collectionId, parentDocumentId, fileName, fileContent) {
    const form = new FormData();
    form.set('collectionId', collectionId);
    if (parentDocumentId) {
        form.set('parentDocumentId', parentDocumentId);
    }
    form.set('publish', true);
    if (fileContent) {
        form.set('file', new Blob([fileContent], {type: 'text/html'}), fileName + ".html");
    } else {
        form.set('file', new Blob([], {type: 'text/html'}), fileName + ".html");
    }

    return (await client.post("api/documents.import", {
        body: form,
    }).json()).data;
}

export async function deleteDocument(documentId) {
    return client.post("api/documents.delete", {
        json: {
            id: documentId,
        },
    }).json();
}
