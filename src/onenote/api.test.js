import { describe, before, after, it } from "node:test";
import assert from "node:assert/strict";

import {fetchOneNoteNotebooks, fetchOneNotePageContent, fetchOneNotePages, fetchOneNoteSections} from "./api.js";

describe("OneNote API", async () => {
  it("should retrieve a list of notebooks", async () => {
    const notebooks = await fetchOneNoteNotebooks();

    console.dir(notebooks);
  });

  it("should retrieve a list of sections", async () => {
    const sections = await fetchOneNoteSections('0-450938CFBAB9329D!518');

    console.dir(sections);
  });

  it("should retrieve a list of pages", async () => {
    const pages = await fetchOneNotePages('0-450938CFBAB9329D!538');

    console.dir(pages);
  });

  it("should retrieve page content", async () => {
    const pages = await fetchOneNotePageContent('0-633a5632c7444c298381f3855876913a!1-450938CFBAB9329D!549');

    console.dir(pages);
  });
});
