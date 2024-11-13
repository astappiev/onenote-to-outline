import { describe, before, after, it } from "node:test";
import assert from "node:assert/strict";

import {fetchNotebooks, fetchPageContent, fetchPages, fetchSections} from "./api.js";

describe("OneNote API", async () => {
  it("should retrieve a list of notebooks", async () => {
    const notebooks = await fetchNotebooks();

    console.dir(notebooks);
  });

  it("should retrieve a list of sections", async () => {
    const sections = await fetchSections('0-450938CFBAB9329D!518');

    console.dir(sections);
  });

  it("should retrieve a list of pages", async () => {
    const pages = await fetchPages('0-450938CFBAB9329D!538');

    console.dir(pages);
  });

  it("should retrieve page content", async () => {
    const pages = await fetchPageContent('0-633a5632c7444c298381f3855876913a!1-450938CFBAB9329D!549');

    console.dir(pages);
  });
});
