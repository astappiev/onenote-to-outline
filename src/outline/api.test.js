import { describe, before, after, it } from "node:test";
import assert from "node:assert/strict";

import {
  convertCollectionToDocument,
  createCollections,
  createDocument,
  fetchCollections,
  fetchDocuments
} from "./api.js";
import {fetchOneNotePageContent} from "../onenote/api.js";

describe("Outline API", async () => {
  it("should retrieve a list of collections", async () => {
    const collections = await fetchCollections();

    console.dir(collections);
  });

  it("should create a new collection", async () => {
      const collection = await createCollections("New Collection");

      console.dir(collection);
  });

  it("should retrieve a list of documents", async () => {
    const documents = await fetchDocuments('0c8488b2-dd14-4bcc-848a-5abe1aa50f12');

    console.dir(documents);
    console.dir(documents.length);
  });

  it("should convert collection to document", async () => {
    await convertCollectionToDocument('96d0886e-1851-4cf9-9536-b148545c96e2', 'd7f9461f-9411-4afe-82d9-bc70426d208d');
  });

  it("should create a new document", async () => {
    const html = await fetchOneNotePageContent('0-633a5632c7444c298381f3855876913a!1-450938CFBAB9329D!549');
    console.log(html);
    const document = await createDocument("275ce812-8679-4c6a-b0a3-b2cf6396ff46", "super long name", html);

    console.dir(document);
  });
});
