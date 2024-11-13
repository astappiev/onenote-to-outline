import { describe, before, after, it } from "node:test";
import assert from "node:assert/strict";

import {createCollections, createDocument, fetchCollections, fetchDocuments} from "./api.js";
import {fetchPageContent} from "../onenote/api.js";

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
    const documents = await fetchDocuments("6cfe6697-392d-4119-aa69-3fc9f2716c74");

    console.dir(documents);
  });

  it("should create a new document", async () => {
    const html = await fetchPageContent('0-633a5632c7444c298381f3855876913a!1-450938CFBAB9329D!549');
    console.log(html);
    const document = await createDocument("6cfe6697-392d-4119-aa69-3fc9f2716c74", "super long name", html);

    console.dir(document);
  });
});
